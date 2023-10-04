
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const reposResults = document.getElementById('repos-results');


searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = searchInput.value.trim();

    if (username === '') {
        alert('Please enter a GitHub username.');
        return;
    }


    searchResults.innerHTML = '';
    reposResults.innerHTML = '';

    try {
        
        const usersResponse = await fetch(`https://api.github.com/search/users?q=${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!usersResponse.ok) {
            throw new Error(`GitHub API request failed with status: ${usersResponse.status}`);
        }

        const usersData = await usersResponse.json();
        const users = usersData.items;

        if (users.length === 0) {
            searchResults.innerHTML = 'No users found.';
        } else {
            
            users.forEach((user) => {
                const userDiv = document.createElement('div');
                userDiv.innerHTML = `
                    <h2>${user.login}</h2>
                    <img src="${user.avatar_url}" alt="${user.login}'s avatar">
                    <a href="${user.html_url}" target="_blank">View Profile</a>
                `;
                searchResults.appendChild(userDiv);

                
                userDiv.addEventListener('click', () => {
                    displayUserRepos(user.login);
                });
            });
        }
    } catch (error) {
        console.error(error);
        searchResults.innerHTML = 'An error occurred while fetching data from GitHub.';
    }
});


async function displayUserRepos(username) {
    try {
        
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!reposResponse.ok) {
            throw new Error(`GitHub API request failed with status: ${reposResponse.status}`);
        }

        const reposData = await reposResponse.json();

        if (reposData.length === 0) {
            reposResults.innerHTML = 'No repositories found for this user.';
        } else {
            
            reposResults.innerHTML = `<h2>Repositories for ${username}</h2>`;
            const repoList = document.createElement('ul');
            reposData.forEach((repo) => {
                const repoItem = document.createElement('li');
                repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
                repoList.appendChild(repoItem);
            });
            reposResults.appendChild(repoList);
        }

        
        reposResults.style.display = 'block';
    } catch (error) {
        console.error(error);
        reposResults.innerHTML = 'An error occurred while fetching user repositories.';
    }
}
