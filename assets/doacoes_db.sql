CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campanhas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    meta DECIMAL(10,2) NOT NULL,
    arrecadado DECIMAL(10,2) DEFAULT 0,
    imagem TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT,
    campanha_id INT,
    valor DECIMAL(10,2) NOT NULL,
    data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (campanha_id) REFERENCES campanhas(id)
);
