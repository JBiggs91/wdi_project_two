# Contact List

<span style="color:gray">This is an application that allows users to store and organize their contacts.</span>

---

# *MVP*

- **Data Model:**
  - The models used in the application are `Contact` and `Category`
  - `Contact` attributes:
    - Name
    - Age
    - Address
    - Phone Number
    - Picture
    - Category_id
  - `Category` attributes:
    - Name
- **Technologies Used:**:
  - AJAX
  - [Random User API](http://randomuser.me/)
  - [Bootstrap](http://getbootstrap.com/) or [Foundation](http://foundation.zurb.com/)
  - jQuery
  - Backbone.js
  - Google Maps API
- **User Stories(MVP)**
  - A user can have three categories of contact lists
    - Example: `Friends`, `Family`, and `Work`
  - A user can create new contacts
  - A user can update and delete existing contacts
  - A user can move contacts between lists
  - A user can assign a random image to contact when creating it
    - This should use the Random User API
  - A user can search through their contacts for a specific contact
  - A user will be alerted when they have entered incomplete information
    - Example: If a user enters Name, Age, Address, and Picture but forgets to enter Phone Number, they will see an error message

# *Features*
- **Drag and Drop**
  - A user can drag and drop contacts to different lists.
  - This will trigger a change in the database to persist the fact that the category has been changed
  - Possible tools to use:
    - [jQuery UI](http://jqueryui.com/)
- **Google Maps API**
  - AJAX used to hit the Google Maps API
  - Inside a modal, shows a map of the contact's info
- **Smart Search**
  - When a user is searching for a contact, the search filters on keydown

