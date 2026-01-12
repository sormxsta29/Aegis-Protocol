-- Aegis Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    address VARCHAR(42) UNIQUE NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('victim', 'merchant', 'admin', 'donor')),
    name VARCHAR(255),
    email VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    tx_hash VARCHAR(66) UNIQUE NOT NULL,
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    token_id INTEGER NOT NULL,
    amount NUMERIC(78, 0) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    block_number INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    INDEX idx_from (from_address),
    INDEX idx_to (to_address),
    INDEX idx_timestamp (timestamp)
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    campaign VARCHAR(255) NOT NULL,
    donor_address VARCHAR(42) NOT NULL,
    amount NUMERIC(78, 0) NOT NULL,
    token_address VARCHAR(42) NOT NULL,
    tx_hash VARCHAR(66) UNIQUE NOT NULL,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_campaign (campaign),
    INDEX idx_donor (donor_address)
);

-- Disasters table
CREATE TABLE IF NOT EXISTS disasters (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    magnitude DECIMAL(5, 2),
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'moderate',
    affected_population INTEGER,
    funds_released NUMERIC(78, 0) DEFAULT 0,
    oracle_verified BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_type (type),
    INDEX idx_timestamp (timestamp)
);

-- Merchants table
CREATE TABLE IF NOT EXISTS merchants (
    id SERIAL PRIMARY KEY,
    address VARCHAR(42) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    category INTEGER NOT NULL,
    location VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    total_redeemed NUMERIC(78, 0) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category)
);

-- Staking table
CREATE TABLE IF NOT EXISTS staking (
    id SERIAL PRIMARY KEY,
    staker_address VARCHAR(42) NOT NULL,
    amount NUMERIC(78, 0) NOT NULL,
    staked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unstaked_at TIMESTAMP,
    rewards_claimed NUMERIC(78, 0) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    INDEX idx_staker (staker_address),
    INDEX idx_status (status)
);

-- NFT Badges table
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    token_id INTEGER UNIQUE NOT NULL,
    owner_address VARCHAR(42) NOT NULL,
    badge_type INTEGER NOT NULL,
    metadata JSONB,
    minted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_owner (owner_address),
    INDEX idx_type (badge_type)
);

-- Governance proposals table
CREATE TABLE IF NOT EXISTS proposals (
    id SERIAL PRIMARY KEY,
    proposal_id NUMERIC(78, 0) UNIQUE NOT NULL,
    proposer_address VARCHAR(42) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    targets TEXT[], -- Array of contract addresses
    values NUMERIC(78, 0)[],
    calldatas TEXT[],
    start_block INTEGER,
    end_block INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    votes_for NUMERIC(78, 0) DEFAULT 0,
    votes_against NUMERIC(78, 0) DEFAULT 0,
    votes_abstain NUMERIC(78, 0) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_proposer (proposer_address),
    INDEX idx_status (status)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    read BOOLEAN DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_address),
    INDEX idx_read (read)
);

-- Supply chain tracking
CREATE TABLE IF NOT EXISTS supply_chain (
    id SERIAL PRIMARY KEY,
    item_id VARCHAR(66) UNIQUE NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    current_location VARCHAR(255),
    current_holder VARCHAR(42),
    status VARCHAR(50) DEFAULT 'in_transit',
    origin VARCHAR(255),
    destination VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_holder (current_holder)
);

-- Analytics aggregation table
CREATE TABLE IF NOT EXISTS daily_stats (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_transactions INTEGER DEFAULT 0,
    total_donations NUMERIC(78, 0) DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    new_disasters INTEGER DEFAULT 0,
    tokens_distributed NUMERIC(78, 0) DEFAULT 0,
    INDEX idx_date (date)
);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supply_chain_updated_at BEFORE UPDATE ON supply_chain
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
