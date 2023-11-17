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
  event_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventImages(
  public_id VARCHAR(255) PRIMARY KEY,
  url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  event_id INT REFERENCES events(event_id)
);

CREATE TABLE compagnies(
  compagny_id SERIAL PRIMARY KEY,
  compagny_name VARCHAR(50) NOT NULL UNIQUE, 
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
  description TEXT,
  age INT ,
  city VARCHAR(50),
  professional_experience TEXT,
  avatar_url VARCHAR(255),
  role_name VARCHAR(50) REFERENCES roles(name),
  compagny_id INT DEFAULT NULL ,
  training_id INT REFERENCES trainings(training_id)
);

CREATE TABLE user_stack(
  user_id INT REFERENCES users(user_id),
  stack_id INT REFERENCES stacks(stack_id),
  PRIMARY KEY (user_id,stack_id)
);

CREATE TABLE jobs(
  job_id SERIAL PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  title VARCHAR(100),
  city VARCHAR(100),
  description TEXT,
  type_job VARCHAR(20) NOT NULL CHECK (type_job IN ('internship', 'job', 'alternation')),
  date Date,
  remuneration  INT,
  experience VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  compagny_id INT REFERENCES compagnies(compagny_id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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

INSERT INTO compagnies(compagny_name,city,adress,avatar_url) VALUES ('Oclock','Paris','1 rue de la paix','https://www.google.com/url');

INSERT INTO compagnies(compagny_name,city,adress,avatar_url) VALUES ('Foreach academy','Paris','10 rue de la paix','https://www.google.com/url');


-- Events
INSERT INTO events (name, description, date, image_url) VALUES
('Événement 1', 'Description de l''événement 1', '2023-10-30', 'https://picsum.photos/600/400?random=1'),
('Événement 2', 'Description de l''événement 2', '2023-11-15', 'https://picsum.photos/600/400?random=2'),
('Événement 3', 'Description de l''événement 3', '2023-11-20', 'https://picsum.photos/600/400?random=3'),
('Événement 4', 'Description de l''événement 4', '2023-12-05', 'https://picsum.photos/600/400?random=4'),
('Événement 5', 'Description de l''événement 5', '2023-12-10', 'https://picsum.photos/600/400?random=5'),
('Événement 6', 'Description de l''événement 6', '2023-12-20', 'https://picsum.photos/600/400?random=6'),
('Événement 7', 'Description de l''événement 7', '2024-01-05', 'https://picsum.photos/600/400?random=7'),
('Événement 8', 'Description de l''événement 8', '2024-01-10', 'https://picsum.photos/600/400?random=8'),
('Événement 9', 'Description de l''événement 9', '2024-01-20', 'https://picsum.photos/600/400?random=9'),
('Événement 10', 'Description de l''événement 10', '2024-02-05', 'https://picsum.photos/600/400?random=10'),
('Événement 11', 'Description de l''événement 11', '2024-02-10', 'https://picsum.photos/600/400?random=11'),
('Événement 12', 'Description de l''événement 12', '2024-02-20', 'https://picsum.photos/600/400?random=12'),
('Événement 13', 'Description de l''événement 13', '2024-03-05', 'https://picsum.photos/600/400?random=13'),
('Événement 14', 'Description de l''événement 14', '2024-03-10', 'https://picsum.photos/600/400?random=14'),
('Événement 15', 'Description de l''événement 15', '2024-03-20', 'https://picsum.photos/600/400?random=15');

-- Jobs
INSERT INTO jobs (is_active, title, city, description, type_job, date, remuneration, experience, email, compagny_id)
VALUES
(TRUE, 'Software Engineer Intern', 'Paris', 'Participate in the development of cutting-edge software solutions.', 'internship', '2024-01-15', 1200, 'No experience required', 'intern1@company.com', 1),
(TRUE, 'Project Manager', 'Lyon', 'Oversee complex projects from inception to completion.', 'job', '2024-02-01', 3500, '5 years of project management', 'pm2@company.com', 2),
(TRUE, 'Web Developer', 'Marseille', 'Contribute to the design and implementation of web applications.', 'job', '2024-03-20', 3200, '2+ years in web development', 'webdev1@company.com', 1),
(TRUE, 'Graphic Designer', 'Toulouse', 'Create compelling visual content for various media.', 'alternation', '2024-04-10', 1500, 'Graphic design portfolio required', 'design2@company.com', 2),
(TRUE, 'Data Analyst Intern', 'Nice', 'Analyze data trends and provide actionable insights.', 'internship', '2024-05-05', 1300, 'Familiarity with data analysis tools', 'data1@company.com', 1);


