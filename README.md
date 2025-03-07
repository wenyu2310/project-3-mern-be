# Developing a 'Company Ideas Incubator Tool' 
![Screenshot 2025-03-07 at 6 54 44 PM](https://github.com/user-attachments/assets/1fe7e0ce-cc3e-489d-a14d-3e396e9a5c7c)


## Link to Site
https://project-2-public-engagement-tool.vercel.app

## Project Brief
This Company Ideas Incubator Tool aims to foster a culture of innovation and collaboration in the company. The tool will provide a platform for
1. Proposals Sharing - Easily submit and share innovative ideas with colleagues.
2. Feedback Collection- Gather constructive feedback to refine and improve concepts.
3. Voting & Prioritization- Identify top ideas through voting and prioritization.the updated information and any changes to design, timeline and upcoming engagement sessions.

## Timeframe
3 weeks
  
## Data Entities
User Schema
```
{
    type: String,
    require: true,
  },
  hashedPassword: {
    type: String,
    require: true,
  },
```

Idea Schema 
```
  {
    "title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Productivity", "Staff Welfare","Service Quality"],
    },
    description: {
      type: String,
      required: true,
    },
    keyBenefits: {
      type: String,
      required: true,
    },
    implementationPlan: {
      type: String,
      required: true,
    },
    anonymity: {
      type: String,
      required: true,
      enum: ["Non-Anonymous", "Anonymous"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, ref: "User", },
      // originalAuthorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // added originalAuthorId to 
    comments: [commentSchema],
    reactions: [reactionSchema],
  },
  { timestamps: true }"
);
```
Comment Schema
```
  {
    text: {
      type: String,
      required: true,
    },
    anonymity: {
      type: String,
      required: true,
      enum: ["Non-Anonymous", "Anonymous"],
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
```

Reaction Schema
```
  {
    type: {
      type: String,
      required: true,
      enum: ["Like", "Dislike"],
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }"
);
```

## CRUD Functions
1. Ideas- Create, Read, Update, and Delete
2. Comments- Create, Read, Update, and Delete, 
3. Likes- Create, Read 

## MVP- Minimum Viable Product
1. At least 3 data entities components
2. The back-end application is built with Express and Node.
3. MongoDB is used as the database management system.
4. The back-end and front-end applications implement JWT token-based authentication to sign up, sign in, and sign out users.
5. Authorization is implemented across the front-end and back-end. Guest users (those not signed in) should not be able to create, update, or delete data in the application or access functionality allowing those actions.
6. The project has at least two data entities in addition to the User model. At least one entity must have a relationship with the User model.
7. The project has full CRUD functionality on both the back-end and front-end.
8. The front-end application does not hold any secret keys. Public APIs that require secret keys must be accessed from the back-end application.

## Tests on Postman screenshot
<img width="1661" alt="Screenshot 2025-03-07 at 7 23 13 PM" src="https://github.com/user-attachments/assets/b896dfad-ba92-47f3-b472-407327740901" />

## Planned future enhancements
- Ideas - Post documents / images
- Improve schema for reactions

## Reflections
- The good : understanding and deploying CURD on Express and learning teamwork for full stack development
- The bad: unsure of initial models, under-estimating tasks
