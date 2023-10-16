CREATE DATABASE alumni;

\c alumni;

CREATE TABLE trainings(
  training_id SERIAL PRIMARY KEY,
  training_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE roles (
  name  VARCHAR(50) PRIMARY KEY
);

CREATE TABLE stacks(
  stack_id SERIAL PRIMARY KEY,
  stack_name VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE events(
  event_id SERIAL PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE,
  image_url VARCHAR(255),
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE compagnies(
  compagny_id SERIAL PRIMARY KEY,
  compagny_name VARCHAR(50) NOT NULL, 
  city VARCHAR(50) NOT NULL,
  adress VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url VARCHAR(255),
  description TEXT
);

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  password VARCHAR(255) NOT NULL,
  CHECK (char_length(name) >= 3 AND char_length(name) <= 50),
  CHECK (char_length(password) >= 6),
  training_id INT REFERENCES trainings(training_id),
  description TEXT,
  age INT NOT NULL,
  city VARCHAR(50) NOT NULL,
  professional_experience TEXT,
  avatar_url VARCHAR(255),
  role_name VARCHAR(50) REFERENCES roles(name),
  compagny_id INT REFERENCES compagnies(compagny_id)
);


CREATE TABLE user_stack(
  user_id INT REFERENCES users(user_id),
  stack_id INT REFERENCES stacks(stack_id),
  PRIMARY KEY (user_id,stack_id)
);



CREATE TABLE jobs(
  job_id SERIAL PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  type_job VARCHAR(20) NOT NULL CHECK (type_job IN ('internship', 'job', 'alternation')),
  compagny_id INT REFERENCES compagnies(compagny_id),
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO roles(name) VALUES('alumni');
INSERT INTO roles(name) VALUES('mentor');
INSERT INTO roles(name) VALUES('recrutor');
INSERT INTO roles(name) VALUES('moderator');
INSERT INTO roles(name) VALUES('admin');



INSERT INTO trainings(training_name) VALUES ('developpeur web');
INSERT INTO trainings(training_name) VALUES ('bachelor');
INSERT INTO trainings(training_name) VALUES ('assistant·e ressources humaines');


insert into stacks(stack_name) values ('HTML');
insert into stacks(stack_name) values ('CSS');
insert into stacks(stack_name) values ('REACT');
insert into stacks(stack_name) values ('JAVASCRIPT');
insert into stacks(stack_name) values ('GIT');
insert into stacks(stack_name) values ('POSTMAN');
