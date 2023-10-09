CREATE DATABASE alumni;

CREATE TABLE trainings(
  training_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    name  VARCHAR(50)
);

CREATE TABLE stacks(
  stack_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);
CREATE TABLE events(
  event_id SERIAL PRIMARY KEY,
  is_activ BOOLEAN NOT NULL DEFAULT FALSE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE,
  image_url VARCHAR(255),
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_activ BOOLEAN NOT NULL DEFAULT FALSE,
  password VARCHAR(255) NOT NULL,
  CHECK (char_length(name) >= 3 AND char_length(name) <= 50),
  CHECK (char_length(password) >= 6),
  training_id INT REFERENCES trainings(training_id),
  description TEXT,
  age INT NOT NULL,
  city VARCHAR(50) NOT NULL,
  professional_experience TEXT,
  role_id INT REFERENCES roles(role_id)
);


CREATE TABLE user_stack(
  user_id INT REFERENCES users(user_id),
  stack_id INT REFERENCES stacks(stack_id),
  PRIMARY KEY (user_id,stack_id)
);

CREATE TABLE compagnies(
  compagny_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  description TEXT,
  adress VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  user_id INT REFERENCES users(user_id)
);

CREATE TABLE jobs(
  job_id SERIAL PRIMARY KEY,
  is_activ BOOLEAN NOT NULL DEFAULT FALSE,
  type_job VARCHAR(20) NOT NULL CHECK (type_job IN ('internship', 'job', 'alternation')),
  compagny_id INT REFERENCES compagnies(compagny_id),
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events(
  event_id SERIAL PRIMARY KEY,
  is_activ BOOLEAN NOT NULL DEFAULT FALSE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE,
  image_url VARCHAR(255),
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

// user roles
INSERT INTO roles(name) VALUES('alumni');
INSERT INTO roles(name) VALUES('mentor');
INSERT INTO roles(name) VALUES('employer');
INSERT INTO roles(name) VALUES('moderator');
INSERT INTO roles(name) VALUES('admin');