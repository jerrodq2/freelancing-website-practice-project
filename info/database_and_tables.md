# This file explains the basic purpose of the database, tables, and how everything fits together

Example Bullet: Just demonstrating the format for the below tables
* **Table_name** - Basic description
	* Ex: Example of record or use
	* One-To-One: Describes which tables it has a one-to-one relationship with
	* One-To-Many: Describes which tables it has a one-to-many relationship with, and which it is in the relationship
	* Many-To-Many: Describes which tables it has a many-to-many relationship with



## Database tables
Below are the individual tables, their purposes/use, examples of each (Ex:), and how they relate to one another

* **admins** - These are the users who have admin privileges. Only meant to act as admins, not post or accept any jobs. Created as a separate Table from clients and freelancers due to them having unnecessary fields/columns for an admin.
	* Ex: The Admin created in the init process, which can see flagged records, mark other users as inactive, etc.
	* One-To-One: No relationship with any other table
	* One-To-Many: N/A
	* Many-To-Many: N/A

* **clients** - These are users who post different jobs, basically the 'client' in the job relationship, the ones who have a need, and need a developers help, ex: need a website made. I made this a separate table from freelancers partially due to the extra fields/columns that freelancers have, and partially just for clarity. It was easier to think of them as separate entities this way. They can create/post jobs, control everything related to said jobs, write reviews about freelancers they've worked with, search for freelancers, mark things as inappropriate, save freelancers, and invite freelancers to accept a job.
	* Ex: A user that posts a job, accepts a contract with a freelancer, and pays the freelancer for their work (if this was in production at least)
	* One-To-One: N/A
	* One-To-Many: has one with fields where a client can only have one field. It also has this relationship with jobs, client_reviews, freelancer_reviews, saved_jobs, saved_clients, proposals, and invitations, where one client can have many of each.
	* Many-To-Many: Both saved_clients and saved_freelancers act as intermediary tables for a many-to-many relationship between clients and freelancers

* **freelancers** - These are the users who come to the site to accept work/jobs. These are the developers who accept and fulfill the job requests and get paid (if this was in production at least). These are the 'workers' in the job relationship. This table is more complex than the client, it has a few more fields such as summary and job_title, and it has several other tables that are only associated with it, such as freelancer_skills, education_history, employment_history and job_activity. For these reasons, I made it a separate table from clients and admins. This type of user can accept jobs, search for clients/jobs, write proposals for a job, write reviews about clients they've worked with, mark things as inappropriate, save clients, and control everything related to them such as their skills and education/employment history.
	* Ex: A user who writes a proposal to a client to take on a job and gets paid for it (if it was in production)
	* One-To-One: N/A
	* One-To-Many: has one with fields where a freelancer can only have one field. It also has this relationship with jobs, client_reviews, freelancer_reviews, saved_jobs, saved_clients, saved_freelancers, job_activity, education_history, employment_history, inappropriate_flags, proposals, and invitations, where one freelancer can have many of each.
	* Many-To-Many: Both saved_clients and saved_freelancers act as intermediary tables for a many-to-many relationship between clients and freelancers. It also has a many-to-many relationship with skills through the freelancer_skills table.

* **fields** - This is a table that is pre-generated via the seeds, it wasn't intended to have any user interaction. It simply shows the general area that certain fields are involved in, ex: web development, Wordpress, front end, mobile app, etc. These are not meant to be added onto or changed in any way.
	* Ex: web development, Wordpress, front end, mobile app, etc.
	* One-To-One: N/A
	* One-To-Many: has this with jobs, clients, and freelancers where they can only have on field, and one field can be associated with many jobs, clients, and freelancers
	* Many-To-Many: N/A

* **skills** - This table is only used for freelancers. It is used to list which skills they have. Since a freelancer can have many skills and each skill can belong to many freelancer, I created this table to have a many-to-many relationship with freelancers through the freelancer_skills table, it doesn't touch any other table. Since many freelancers can have an 'html' skill, the skills model checks that a skill isn't already in the database before it is created.
	* Ex: html, python, Wordpress, node, etc.
	* One-To-One: N/A
	* One-To-Many: N/A
	* Many-To-Many: It has a many-to-many relationship with freelancers through the freelancer_skills table

* **freelancer_skills** - This table acts as an intermediary between the many-to-many relationship between freelancers and skills, has no other purpose.
	* Ex: has the freelancer_id and skill_id for a freelancer that has an 'html' skill.
	* One-To-One: N/A
	* One-To-Many: has this relationship with both skills and freelancer_skills where one skill or freelancer can have many freelancer_skills
	* Many-To-Many: N/A

* **education_history** - This table is only used for freelancers. It is used to keep track of the past education of a freelancer for their profile.
	* Ex: freelancer went to texas tech from 1/8/2011 to 5/1/2015
	* One-To-One: N/A
	* One-To-Many: has this with freelancers, with one freelancer having many education_histories
	* Many-To-Many: N/A

* **employment_history** - This table is only used for freelancers. It is used to keep track of the past jobs of a freelancer for their profile.
	* Ex: freelancer worked at google for 8 years, from date A to date B
	* One-To-One: N/A
	* One-To-Many: has this with freelancers, with one freelancer having many employment_histories
	* Many-To-Many: N/A

* **jobs** - This table is the main part of the project, it is the jobs that connect the other main tables. These are jobs that are created and post by clients, and accepted by freelancers. The main focus of this project is centerd around this table and how it works with other tables.
	* Ex: a 'job' to create a simple front end website can be created by a client, then later accepted by a freelancer.
	* One-To-One: client_reviews, freelancer_reviews, job_activity
	* One-To-Many: has one with fields, clients, and freelancers where a job can only have one of each. It also has this relationship with proposals, invitations, saved_jobs where one job can have many of each.
	* Many-To-Many: N/A

* **invitations** - This table is used so clients can 'invite' a freelancer to take a job. Basically, they send this to the freelancer, it has basic info about the job, and they are asking the freelancer to take said job.
	* Ex: A client creates a job, sends out invitations to 10 different freelancers to try and get a taker.
	* One-To-One: N/A
	* One-To-Many: has this with clients, freelancers, and jobs, where an invitation can only have one of each
	* Many-To-Many: N/A

* **proposals** - This table is used so a freelancer can 'propose' to take a job for a client. Basically, they send this to the client, saying what they can do for the client, and ask the client if they can take said job.
	* Ex: A freelancer is searching for jobs, finds one, likes it, and sends a proposal to the client asking if they can take the job.
	* One-To-One: N/A
	* One-To-Many: has this with clients, freelancers, and jobs, where a proposal can only have one of each
	* Many-To-Many: N/A

* **client_reviews** - This table is where freelancers can write reviews about clients they have worked with, or basically where clients get reviewed. After working on a job for a client, the freelancer can then write a single review about the client.
	* Ex: freelancer takes a clients job, finishes it, and gives the client a 5 star review about how great of a client he was.
	* One-To-One: It has this relationship with jobs
	* One-To-Many: it has this with clients and freelancers with the client_review only having one of each
	* Many-To-Many: N/A

* **freelancer_reviews** - This table is where clients can write reviews about freelancers they have worked with, or basically where freelancers get reviewed. After having a freelancer take their job, the client can then write a single review about the freelancer.
	* Ex: A client has a freelancer take and complete their job, the client then writes about what an amazing job the freelancer did.
	* One-To-One: It has this relationship with jobs
	* One-To-Many: it has this with clients and freelancers with the freelancer_review only having one of each
	* Many-To-Many: N/A

* **saved_clients** - This table is so freelancers can save clients that they like so they have quick access to them later. Similar to a saved videos playlist on youtube.
	* Ex: Freelancer sees or works with a client he likes, saves the client so they can easily find them later.
	* One-To-One: N/A
	* One-To-Many: has this relationship with both clients and freelancers with the saved_clients only having one of each
	* Many-To-Many: N/A

* **saved_freelancers** - This table is so clients can save freelancers that they like so they have quick access to them later. Similar to a saved videos playlist on youtube.
	* Ex: Client sees or works with a freelancer he likes, saves the freelancer so they can easily find them later.
	* One-To-One: N/A
	* One-To-Many: has this relationship with both clients and freelancers with the saved_freelancers only having one of each
	* Many-To-Many: N/A

* **saved_jobs** - This table is so freelancers can save jobs that they want to view later so they have quick access to them later. Similar to a saved videos playlist on youtube.
	* Ex: A freelancer is searching through the jobs, sees a few he likes and might take, saves them for later
	* One-To-One: N/A
	* One-To-Many: has this relationship with clients, freelancers, and jobs with the saved_jobs only having one of each
	* Many-To-Many: N/A

* **job_activity** - This table is a list of jobs that a freelancer has previously worked on. The freelancer has no control over it, once the freelancer accepts the job, and the job is finished, that job is added to their job_activity. It is focused on the freelancer, it comes with a client and job id for information purposes.
	* Ex: Freelancer finishes a job, it is then added to their job_activity
	* One-To-One: N/A
	* One-To-Many: has this relationship with clients, freelancers, and jobs with the job_activity only having one of each
	* Many-To-Many: N/A

* **inappropriate_flags** - This last table is so that either clients or freelancers can mark a record as inappropriate, so that it can then be viewed by an admin later. A job, client, freelancer, client_review, freelancer_review, proposal, or invitation can all be flagged as inappropriate. aside from a client or freelancer being the object flagged, it also saves either the client_id or freelancer_id of the user who actually flagged the object.
	* Ex: A client flags a review from a freelancer for explicit language, or a freelancer flags a client who they think is a fake profile.
	* One-To-One: N/A
	* One-To-Many: It has this relationship with jobs, clients, freelancers, client_reviews, freelancer_reviews, proposals, and invitations with inappropriate_flags only having one of each.
	* Many-To-Many: N/A
