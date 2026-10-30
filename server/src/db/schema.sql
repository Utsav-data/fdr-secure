-- ==============================================================================
-- AICTE Security Deposit / FDR Management Portal - PostgreSQL Schema
-- Zero-Trust Architecture with Cryptographic Lock Verification
-- ==============================================================================

-- Enable UUID extension (pgcrypto provides gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Institutions Table
-- Stores AICTE affiliated institutions and universities
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    aicte_id VARCHAR(100) NOT NULL UNIQUE,
    region VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. Users Table
-- Supports AICTE administrators, institutional officers, and auditors
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES Institutions(id) ON DELETE SET NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('aicte_admin', 'institution_admin', 'finance_officer', 'auditor')),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. FDR_Records Table
-- Security deposit / Fixed Deposit Receipts with zero-trust cryptographic lock
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS FDR_Records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES Institutions(id) ON DELETE CASCADE,
    fdr_number VARCHAR(100) NOT NULL UNIQUE,
    bank_name VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount >= 0),
    issue_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (status IN ('PENDING', 'PENDING_VERIFICATION', 'ACTIVE', 'FLAGGED', 'VERIFIED', 'EXPIRED', 'LIEN_MARKED', 'REJECTED', 'RELEASED', 'RENEWAL_REQUIRED')),
    verification_source VARCHAR(100) DEFAULT 'MANUAL',
    lien_active BOOLEAN NOT NULL DEFAULT TRUE,
    cryptographic_lock_hash VARCHAR(255),
    consent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (maturity_date >= issue_date)
);

-- ------------------------------------------------------------------------------
-- 4. Regulations Table
-- AICTE regulatory guidelines and statutory compliance benchmarks
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Regulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. Compliance_Tasks Table
-- Tracks regulatory compliance and FDR verification per institution
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Compliance_Tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES Institutions(id) ON DELETE CASCADE,
    regulation_id UUID NOT NULL REFERENCES Regulations(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLIANT', 'NON_COMPLIANT', 'OVERDUE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 6. Consent_Artifacts Table
-- Account Aggregator (AA) / Setu consent lifecycle for automated verification
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Consent_Artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES Institutions(id) ON DELETE CASCADE,
    consent_id VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'ACTIVE', 'REVOKED', 'EXPIRED', 'PAUSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- Performance Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_institution_id ON Users(institution_id);
CREATE INDEX IF NOT EXISTS idx_fdr_records_institution_id ON FDR_Records(institution_id);
CREATE INDEX IF NOT EXISTS idx_fdr_records_status ON FDR_Records(status);
CREATE INDEX IF NOT EXISTS idx_compliance_tasks_institution_id ON Compliance_Tasks(institution_id);
CREATE INDEX IF NOT EXISTS idx_compliance_tasks_regulation_id ON Compliance_Tasks(regulation_id);
CREATE INDEX IF NOT EXISTS idx_consent_artifacts_institution_id ON Consent_Artifacts(institution_id);
