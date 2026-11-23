# Guia de Banco de Dados e Segurança para cPanel

## 1. Banco de Dados no cPanel

### Sim, é possível adicionar banco de dados no cPanel!

O cPanel oferece suporte nativo para:
- **MySQL** (mais comum)
- **PostgreSQL**
- **MariaDB**

### Como criar banco de dados no cPanel:

#### Passo 1: Acessar cPanel
1. Faça login no seu cPanel
2. Procure por "Databases" ou "Banco de Dados"

#### Passo 2: Criar Banco de Dados MySQL
1. Clique em "MySQL Database Wizard"
2. **Step 1**: Nome do banco de dados
   - Escolha um nome (ex: `web3_wallet`)
   - Clique em "Next Step"
3. **Step 2**: Criar usuário
   - Nome do usuário (ex: `wallet_user`)
   - Senha forte (mínimo 12 caracteres, com maiúsculas, minúsculas, números e símbolos)
   - Clique em "Next Step"
4. **Step 3**: Privilégios
   - Selecione "ALL PRIVILEGES" para acesso completo
   - Clique em "Next Step"
5. **Step 4**: Adicionar usuário ao banco
   - Marque o checkbox para adicionar o usuário ao banco
   - Clique em "Next Step"

#### Passo 3: Acessar phpMyAdmin
1. No cPanel, clique em "phpMyAdmin"
2. Selecione o banco de dados criado
3. Você pode criar tabelas via interface ou SQL

### Estrutura de Tabelas Sugerida

```sql
-- Tabela de usuários
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Tabela de sessões
CREATE TABLE sessions (
  id VARCHAR(128) PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de levantamentos
CREATE TABLE withdrawals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  phase INT NOT NULL,
  currency VARCHAR(10) NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  fee DECIMAL(20, 8) NOT NULL,
  net_amount DECIMAL(20, 8) NOT NULL,
  withdrawal_method VARCHAR(50) NOT NULL,
  wallet_address TEXT NULL,
  bank_details JSON NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de histórico de transações
CREATE TABLE transaction_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 2. Melhorando o Sistema de Login

### Problemas Atuais
O sistema atual provavelmente usa armazenamento no frontend (localStorage/sessionStorage), o que é **inseguro**.

### Solução Recomendada: Backend PHP com JWT

#### Por que usar JWT (JSON Web Tokens)?
- Stateless (não precisa armazenar sessões no servidor)
- Seguro quando configurado corretamente
- Fácil de implementar
- Funciona bem com APIs REST

#### Estrutura do Backend

##### 1. API de Autenticação (`api/auth.php`)

```php
<?php
// api/auth.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../vendor/autoload.php';
require_once '../config/database.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Configurações JWT
define('JWT_SECRET', 'sua-chave-secreta-muito-longa-e-segura');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION', 3600); // 1 hora

// Conexão com banco de dados
$db = new Database();
$conn = $db->getConnection();

// Login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    // Validar input
    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username e password são obrigatórios']);
        exit;
    }

    // Buscar usuário
    $stmt = $conn->prepare("SELECT id, username, email, password_hash FROM users WHERE username = ? AND is_active = TRUE");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciais inválidas']);
        exit;
    }

    // Atualizar último login
    $updateStmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $updateStmt->execute([$user['id']]);

    // Gerar JWT
    $payload = [
        'iss' => 'web3-wallet',
        'iat' => time(),
        'exp' => time() + JWT_EXPIRATION,
        'user_id' => $user['id'],
        'username' => $user['username']
    ];

    $jwt = JWT::encode($payload, JWT_SECRET, JWT_ALGORITHM);

    // Criar refresh token
    $refreshToken = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));

    $sessionStmt = $conn->prepare("INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)");
    $sessionId = bin2hex(random_bytes(16));
    $sessionStmt->execute([$sessionId, $user['id'], $refreshToken, $expiresAt]);

    echo json_encode([
        'success' => true,
        'token' => $jwt,
        'refresh_token' => $refreshToken,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]
    ]);
}

// Registro
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'register') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // Validações
    if (empty($username) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Todos os campos são obrigatórios']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email inválido']);
        exit;
    }

    if (strlen($password) < 8) {
        http_response_code(400);
        echo json_encode(['error' => 'Password deve ter no mínimo 8 caracteres']);
        exit;
    }

    // Verificar se usuário já existe
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Username ou email já existe']);
        exit;
    }

    // Hash da senha
    $passwordHash = password_hash($password, PASSWORD_ARGON2ID);

    // Inserir usuário
    $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $passwordHash]);

    echo json_encode(['success' => true, 'message' => 'Usuário criado com sucesso']);
}

// Verificar token
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'verify') {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Token não fornecido']);
        exit;
    }

    $jwt = $matches[1];

    try {
        $decoded = JWT::decode($jwt, new Key(JWT_SECRET, JWT_ALGORITHM));
        echo json_encode(['valid' => true, 'user' => $decoded]);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Token inválido ou expirado']);
    }
}
?>
```

##### 2. Configuração do Banco de Dados (`config/database.php`)

```php
<?php
// config/database.php
class Database {
    private $host = 'localhost';
    private $db_name = 'web3_wallet';
    private $username = 'wallet_user';
    private $password = 'sua-senha-aqui';
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
```

##### 3. Instalar biblioteca JWT

```bash
cd api
composer require firebase/php-jwt
```

### 3. Validação de Formulários no Frontend

#### Melhorando a validação no WithdrawalModal

```typescript
// Adicionar validação mais robusta
const validateWithdrawalAmount = (value: string, currency: string): { valid: boolean; error?: string } => {
  const numValue = parseFloat(value);
  
  if (!value || isNaN(numValue)) {
    return { valid: false, error: 'Por favor, insira um valor válido' };
  }
  
  if (numValue <= 0) {
    return { valid: false, error: 'O valor deve ser maior que zero' };
  }
  
  if (numValue > amount) {
    return { valid: false, error: 'Valor excede o saldo disponível' };
  }
  
  // Validações específicas por moeda
  if (currency === 'BTC' && numValue < 0.0001) {
    return { valid: false, error: 'Valor mínimo para BTC é 0.0001' };
  }
  
  if (currency === 'ETH' && numValue < 0.001) {
    return { valid: false, error: 'Valor mínimo para ETH é 0.001' };
  }
  
  return { valid: true };
};
```

### 4. Segurança Adicional

#### Rate Limiting
Implementar limitação de tentativas de login:

```php
// Adicionar tabela de rate limiting
CREATE TABLE login_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  username VARCHAR(50),
  attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ip (ip_address),
  INDEX idx_time (attempt_time)
);

// Verificar tentativas
$stmt = $conn->prepare("SELECT COUNT(*) FROM login_attempts WHERE ip_address = ? AND attempt_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
$stmt->execute([$ip]);
$attempts = $stmt->fetchColumn();

if ($attempts >= 5) {
    http_response_code(429);
    echo json_encode(['error' => 'Muitas tentativas. Tente novamente em 15 minutos.']);
    exit;
}
```

#### CSRF Protection
Adicionar tokens CSRF para formulários:

```php
session_start();

function generateCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrfToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
```

### 5. HTTPS Obrigatório

No cPanel:
1. Vá para "SSL/TLS Status"
2. Ative "AutoSSL" (se disponível)
3. Ou instale certificado Let's Encrypt gratuito

Redirecionar todo tráfego para HTTPS no `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 6. Backup Automático

Configurar backups no cPanel:
1. Vá para "Backup"
2. Configure "Backup Wizard"
3. Agende backups diários/semanais
4. Configure backup para armazenamento remoto (Google Drive, Dropbox, etc.)

## Resumo

### Para implementar:
1. ✅ Criar banco de dados MySQL no cPanel
2. ✅ Criar tabelas necessárias
3. ✅ Instalar biblioteca JWT via Composer
4. ✅ Criar API PHP de autenticação
5. ✅ Implementar validação no frontend
6. ✅ Adicionar rate limiting
7. ✅ Configurar HTTPS
8. ✅ Configurar backups automáticos

### Próximos passos:
- Implementar a API PHP
- Atualizar o frontend para usar a API
- Testar fluxo completo de autenticação
- Configurar monitoramento de segurança
