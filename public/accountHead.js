const navbar = document.getElementById("topbar");
navbar.innerHTML = `<h1><a href="/">NoteNest<a></h1> 
                      <div class="actions"> 
                        <a href="/search">Search Notes</a> 
                        <a href="/upload">Upload</a> 
                        <a href="/bookmarks">Bookmarks</a> 
                        <a href="/profile">Profile</a> 
                        <img src="/public/images/circle.png" alt="User Icon" class="profile-icon"> 
                      </div>`;
