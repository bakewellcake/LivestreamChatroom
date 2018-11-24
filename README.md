### Description

Live chatroom with authentication using JWT.

- Server: Node.js
- Client: Vue.js, Vuetify

### Installation

Create relevant tables with query below. I suggest adding 10 new records into the users table as there is a function that will select a random ID for a record from that table between 1 and 10 to demonstrate the websockets feature of this chat client. This can be done via SQL inserts or simply done manually via the registration screen.

```sql
create database livestream;

create table livestream.user (
	id serial not null,
	username varchar(256) not null,
	password varchar(256) not null,
	constraint user_pkey primary key (id)
);

create table livestream.history (
	id serial not null,
	user_id int not null,
	message varchar(4096) not null,
    created_datetime timestamp not null,
    CONSTRAINT history_pkey PRIMARY KEY (id),
    CONSTRAINT history_user_id FOREIGN KEY (user_id)
        REFERENCES livestream.user (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE	
);
```
Install packages and then run the server. Browse to ```http://localhost:4401``` in your web browser.

```sh
$ npm install
$ npm run build
$ node index.js
```

### Bugs

- Registration and login fields aren't cleared on change of page state
- Registration and login fields don't turn red on error
- Missing favicon
- Scroll bar on chat window twitches for a microsecond when a new message is added
- There's a few pixels of space just below the livestream video that aren't filled by the embeded video