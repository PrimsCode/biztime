DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE If EXISTS industries;
DROP TABLE If EXISTS associates;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE associates (
  id serial PRIMARY KEY,
  comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
  ind_code text NOT NULL REFERENCES industries ON DELETE CASCADE
);

INSERT INTO companies (code, name, description) 
VALUES ('apple', 'Apple Computer', 'Maker of OSX.'), 
('ibm', 'IBM', 'Big blue.'), 
('ford', 'Ford', 'An American car company.');

INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null),
         ('ford', 600, true, '2017-02-02');

INSERT INTO industries (code, name)
 VALUES ('acct', 'accounting'), 
        ('makt', 'marketing'),
        ('tech', 'technology'),
        ('auto', 'automobile');

INSERT INTO associates (comp_code, ind_code)
 VALUES ('apple', 'tech'),
        ('ibm', 'tech'),
        ('ford', 'auto');
