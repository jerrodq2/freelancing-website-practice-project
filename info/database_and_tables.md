# This file explains the basic purpose of the database, tables, and how everything fits together

## Database tables
Below are the individual tables, their purposes/use, examples of each (Ex:), and how they relate to one another (Relates:)

* **admins** - These are the users who have admin privileges. Only mean to act as admins, not post or accept any jobs. Created as a separate Table from clients and freelancers due to them having unnecessary fields/columns for an admin.
	* Ex: The Admin created in the init process, which can see flagged records, mark other users as inactive, etc.
	* Relates: not related to other tables

* **clients** - These are users who post different jobs, basically the 'client' in the job relationship, the ones who have a need, and need an developers help, ex: need a website made. I made this a separate table from freelancers partially due to the extra fields/columns that freelancers have, and partially just for clarity. It was easier to think of them as separate entities this way. They can create/post jobs, control everything related to said jobs, write reviews about freelancers they've worked with, search for freelancers, mark things as inappropriate, save freelancers, and invite freelancers to accept a job.
	* Ex: A user that posts a job, accepts a contract with a freelancer, and pays the freelancer for their work (if this was in production at least)
	* Relates: it has a one-to-one relationship with the fields table. It has a one-to-many with saved_clients, saved_freelancers, client_reviews, freelancer_reviews, jobs, and invitations with the client being the one in each relationship.

* **freelancers** - These are the users who come to the site to accept work/jobs. These are the developers who accept and fulfill the job requests and get paid (if this was in production at least). These are the 'workers' in the job relationship. This table is more complex than the client, it has a few more fields such as summary and job_title, and it has several other tables that are only associated with it, such as freelancer_skills, education_history, employment_history and job_activity. For these reasons, I made it a separate table from clients and admins. This type of user can accept jobs, search for clients/jobs, write proposals for a job, write reviews about clients they've worked with, mark things as inappropriate, save clients, and control everything related to them such as their skills and education/employment history.
	* Ex: A user who writes a proposal to a client to take on a job and gets paid for it (if it was in production)
	* Relates: it has a one-to-one relationship with the fields table. It has a many-to-many relationship with skills via the freelancer_skills table acting as an intermediary. It also has a one-to-many with saved_jobs, saved_clients, saved_freelancers, job_activity, client_reviews, freelancer_reviews, education_history, employment_history, inappropriate_flags, jobs, proposals, and invitations with the freelancer being the one in each relationship.

* **fields** - This is a table that is pre-generated via the seeds, it wasn't intended to have any user interaction. It simply shows the general area that certain fields are involved in, ex: web development, Wordpress, front end, mobile app, etc. These are not meant to be added onto or changed in any way.
	* Ex: web development, Wordpress, front end, mobile app, etc.
	* Relates: has a one-to-one relationship with jobs, clients, and freelancers

* **skills** - This table is only used for freelancers. It is used to list which skills they have. Since a freelancer can have many skills and each skill can belong to many freelancer, I created this table to have a many-to-many relationship with freelancers through the freelancer_skills table, it doesn't touch any other table. Since many freelancers can have an 'html' skill, the skills model checks that a skill isn't already in the database before it is created.
	* Ex: html, python, Wordpress, node, etc.
	* Relates: Has a many-to-many relationship with freelancer_skills table, doesn't touch any other table.

* **freelancer_skills** - This table acts as an intermediary between the many-to-many relationship between freelancers and skills, has no other purpose.
	* Ex: has the freelancer_id and skill_id for a freelancer that has an 'html' skill.
	* Relates: Has a one-to-many relationship with both freelancers and skills, with the freelancer_skills being the many.

* **education_history** - This table is only used for freelancers. It is used to keep track of the past education of a freelancer for their profile.
	* Ex: freelancer went to texas tech from 1/8/2011 to 5/1/2015
	* Relates: has a one-to-many relationship with freelancers, with education_history being the many.

* **employment_history** - This table is only used for freelancers. It is used to keep track of the past jobs of a freelancer for their profile.
	* Ex: freelancer worked at google for 8 years, from date A to date B
	* Relates: has a one-to-many relationship with freelancers, with employment_history being the many.

* **jobs** - This table is the main part of the project, it is the jobs that connect the other main tables. These are jobs that are created and post by clients, and accepted by freelancers. The main focus of this project is centerd around this table and how it works with other tables.
	* Ex: a 'job' to create a simple front end website can be created by a client, then later accepted by a freelancer.
	* Relates: Has a one-to-many relationship with clients, with the client being the one. It also has a one-to-many relationship with proposals and invitations with the job being the one. Lastly, it has a one-to-one relationship with freelancers, fields, client_reviews, freelancer_reviews, saved_jobs, and job_activity.

* **invitations** - This table is used so clients can 'invite' a freelancer to take a job. Basically, they send this to the freelancer, it has basic info about the job, and they are asking the freelancer to take said job.
	* Ex: A client creates a job, sends out invitations to 10 different freelancers to try and get a taker.
	* Relates: It has a one-many relationship with both clients, freelancers, and jobs, with invitations being the one in all three cases.

* **proposals** - This table is used so a freelancer can 'propose' to take a job for a client. Basically, they send this to the client, saying what they can do for the client, and ask the client if they can take said job.
	* Ex: A freelancer is searching for jobs, finds one, likes it, and sends a proposal to the client asking if they can take the job.
	* Relates: It has a one-many relationship with both clients, freelancers, and jobs, with proposals being the one in all three cases.




* **client_reviews** - Info
	* Ex: example
	* Relates: relates

* **freelancer_reviews** - Info
	* Ex: example
	* Relates: relates


* **inappropriate_flags** - Info
	* Ex: example
	* Relates: relates





* **job_activity** - Info
	* Ex: example
	* Relates: relates





* **saved_clients** - Info
	* Ex: example
	* Relates: relates

* **saved_freelancers** - Info
	* Ex: example
	* Relates: relates

* **saved_jobs** - Info
	* Ex: example
	* Relates: relates
