/*
* Chandler Finuf
* main.js
* This file is part of the final project submission for INF651 - Front End Web Development
*/
// Function 1: createElemWithText
function createElemWithText(tag = 'p', text = '', className = '') {
    const elem = document.createElement(tag);
    elem.textContent = text;
    if (className) {
      elem.classList.add(className);
    }
    return elem;
  }
  
  
// Function 2: createSelectOptions
function createSelectOptions(users) {
    if (!users || !Array.isArray(users)) {
      return undefined;
    }
  
    return users.map(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.name;
      return option;
    });
  }
  
  
// Function 3: toggleCommentSection
function toggleCommentSection(postId) {
    if (!postId) {
      return undefined;
    }
  
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (!section) {
      return null;
    }
  
    section.classList.toggle('hide');
    return section;
  }
  
  // Function 4: toggleCommentButton
  function toggleCommentButton(postId) {
    if (!postId) {
      return undefined;
    }
  
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (!button) {
      return null;
    }
  
    button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    return button;
  }
  
  
  
// Function 5: deleteChildElements
function deleteChildElements(parentElement) {
    if (!parentElement || !(parentElement instanceof Element)) {
      return undefined;
    }
  
    let child = parentElement.lastElementChild;
    while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
    }
  
    return parentElement;
  }
  
  
  //Function 6: addButtonListeners
  function addButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    buttons.forEach(button => {
      const postId = button.dataset.postId;
      if (postId) {
        button.addEventListener('click', (event) => {
          toggleComments(event, postId);
        });
      }
    });
    return buttons;
  }
  
  
  

  
  // Function 7: removeButtonListeners
  function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    buttons.forEach(button => {
      const postId = button.dataset.postId;
      if (postId) {
        button.removeEventListener('click', () => {
          toggleComments(event, postId);
        });
      }
    });
    return buttons; // Return the NodeList of buttons
  }
  
  //Function 8: createComments
  function createComments(comments) {
    if (!comments) {
      return;
    }
  
    const fragment = document.createDocumentFragment();
  
    comments.forEach(comment => {
      const article = document.createElement('article');
      
      const h3 = document.createElement('h3');
      h3.textContent = comment.name;
  
      const p1 = document.createElement('p');
      p1.textContent = comment.body;
  
      const p2 = document.createElement('p');
      p2.textContent = `From: ${comment.email}`;
  
      article.appendChild(h3);
      article.appendChild(p1);
      article.appendChild(p2);
  
      fragment.appendChild(article);
    });
  
    return fragment;
  }
  


  
  
  
// Function 9: populateSelectMenu
function populateSelectMenu(users) {
    if (!users || !Array.isArray(users)) {
      return undefined;
    }
  
    const selectMenu = document.getElementById('selectMenu');
    if (!selectMenu) {
      return undefined;
    }
  
    selectMenu.innerHTML = ''; // Clear existing options
    const options = createSelectOptions(users);
    if (options) {
      options.forEach(option => {
        selectMenu.appendChild(option);
      });
    }
  
    return selectMenu;
  }
  
  
  
  // Function 10: getUsers
  async function getUsers() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  
// Function 11: getUserPosts
async function getUserPosts(userId) {
    if (!userId) {
      return undefined;
    }
  
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      return undefined;
    }
  }
  
  // Function 12: getUser
  async function getUser(userId) {
    if (!userId) {
      return undefined;
    }
  
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const user = await response.json();
      return user;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return undefined;
    }
  }
  
  // Function 13: getPostComments
  async function getPostComments(postId) {
    if (!postId) {
      return undefined;
    }
  
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      const comments = await response.json();
      return comments;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      return undefined;
    }
  }
  
  
  
// Function 14: displayComments
async function displayComments(postId) {
    if (!postId) {
        return undefined;
    }

    const comments = await getPostComments(postId);
    const section = document.createElement('section');
    section.dataset.postId = postId;
    section.classList.add('comments', 'hide');
    const commentsFragment = await createComments(comments);
    section.appendChild(commentsFragment);
    return section;
}
//Function 15: createPosts
async function createPosts(posts) {
    if (!Array.isArray(posts)) {
      return undefined;
    }
  
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
      const article = document.createElement('article');
      const h2 = createElemWithText('h2', post.title);
      const bodyParagraphs = createElemWithText('p', post.body);
      const button = document.createElement('button');
      button.textContent = 'Show Comments'; // Update as needed
      button.dataset.postId = post.id;
      const commentsSection = await displayComments(post.id);
  
      article.appendChild(h2);
      article.appendChild(bodyParagraphs);
      article.appendChild(button);
      article.appendChild(commentsSection);
  
      fragment.appendChild(article);
    }
  
    return fragment;
  }
  

  
  
// Function 16: displayPosts
async function displayPosts(postsData) {
    const mainElement = document.querySelector('main');
    let element;
  
    if (postsData && postsData.length > 0) {
      // If posts exist, create the element using createPosts
      element = await createPosts(postsData);
    } else {
      // If no posts exist, create a default paragraph
      element = createElemWithText('p', 'No posts available. Select an Employee to display their posts.');
      element.classList.add('default-text');
    }
  
    // Append the element to the main element
    mainElement.textContent = ''; // Clear existing content
    mainElement.appendChild(element);
  
    return element;
  }
  
  
  
  
  
  
  //Function 17: toggleComments
  function toggleComments(event, postId) {
    if (!event || !postId) {
      return undefined;
    }
  
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
  
    if (!section || !button) {
      return undefined;
    }
  
    return [section, button];
  }
  
  
  
// Function 18: refreshPosts
async function refreshPosts(posts) {
    if (!posts || !Array.isArray(posts)) {
      return undefined;
    }
  
    const promises = posts.map(async post => {
      const comments = await getPostComments(post.id);
      const commentsSection = displayComments(post.id);
      const commentsFragment = await createComments(comments);
      commentsSection.appendChild(commentsFragment);
      return createPosts([post])[0];
    });
  
    return Promise.all(promises);
  }
  

// Function 19: selectMenuChangeEventHandler
function selectMenuChangeEventHandler(event) {
    return new Promise((resolve) => {
      if (!event || !event.target || !event.target.value) {
        resolve(undefined);
        return;
      }
  
      const userId = event.target.value;
  
      getUserPosts(userId)
        .then((posts) => refreshPosts(posts))
        .then((refreshPostsArray) => {
          resolve([userId, posts, refreshPostsArray]);
        })
        .catch((error) => {
          console.error(error);
          resolve(undefined);
        });
    });
  }
  
  
  
  // Function 20: initPage
  async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
  }
  
  // Function 21: initApp
  function initApp() {
    initPage().then(([users, select]) => {
      const selectMenu = document.getElementById('selectMenu');
      selectMenu.addEventListener('change', selectMenuChangeEventHandler);
    });
  }
  
  // Event listener for DOMContentLoaded to call initApp
  document.addEventListener('DOMContentLoaded', initApp);
  