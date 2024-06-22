#Academic Digital Library Application
This is an academic digital library search interface built with Angular and  Material UI components. This interface was created to asses Dilex (another digital library search application) in a controlled laboratory test where this interface was the baseline condition used by half of the participants. The app consumes a node.js (express) REST API which uses Exlibris REST API for fetching search results and uses mongoDB atlas database for storing search queries, saved documents, and user data.

##Features
- JWT Authentication with acess and refresh tokens
- Material UI Component
- Search Page Features:
	- Search, views, save/delete documents
	- Select and save/delete documents in batch
	- Assign labels to selected documents
	- Save search query to workspace
- Personal Workspace Features:
	- History Tab: Browse, delete, reissue search history in single or batch mode
	- Saved Query Tab: Browse delete, reissue saved search queries or batch mode
	- Saved documents Tab:
		- Browse, delete, view saved documents
		- Select documents and assign new or existing labels
		- Remove labels from documents
		- Filter saved documents by labels

##Prerequisites

- Node.js (version v18.20.2 or higher)
- npm (Node Package Manager)
- Angular CLI (Command Line Interface)

##Installation
Clone repo: `$ git clone git@bitbucket.org:romy6047/uregina-baseline.git`

Install: `$ npm install`

Start app: `$ ng serve `

Make sure the node.js repo is running