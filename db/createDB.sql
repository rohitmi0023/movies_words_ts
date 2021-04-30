-- Create db
-- create database movies_words;

-- Movies title schema
CREATE TABLE movies_details (
    id VARCHAR(255) PRIMARY KEY,
    adult TINYINT(1),
    homepage VARCHAR(255),
    title VARCHAR(255),
    original_title VARCHAR(255),
    original_language VARCHAR(255),
    popularity INT,
    released_date VARCHAR(255),
    imdb_id VARCHAR(255),
    genre VARCHAR(255),
    poster_path VARCHAR(255),
    production_countries VARCHAR(255),
    runtime INT,
    status VARCHAR(255),
    tagline VARCHAR(255),
    video TINYINT(1),
    vote_average INT,
    vote_count INT
);

-- Movies word schema
CREATE TABLE movies_word (
    id VARCHAR(255) PRIMARY KEY,
    word VARCHAR (255) NOT NULL,
    movie_id VARCHAR (255),
    upvotes int DEFAULT 0,
    added_by VARCHAR (255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profane TINYINT(1)
);

-- Users schema
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_hash VARCHAR(255),
    is_Verified TINYINT(1) DEFAULT 0,
    date_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar VARCHAR(255)
);

-- voting schema
CREATE TABLE voting (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    word_id VARCHAR(255),
    upvoted_by VARCHAR(255) DEFAULT NULL,
    downvoted_by VARCHAR(255) DEFAULT NULL
);  

-- subtitles schema 
CREATE TABLE subtitles (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    movie_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_size INT NOT NULL
);