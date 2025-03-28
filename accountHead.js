const navbar = document.getElementById("topbar");
navbar.innerHTML += '<div class="heading">' +
                      '<h1 class="no-underline" href="#">NoteNest</h1>' +
                      '<div class="actions">' +
                        '<a href="/signup" class="no-underline">Search Notes</a>' +
                        '<a href="/upload" class="no-underline">Upload</a>' +
                        '<a href="/signup" class="no-underline">Bookmarks</a>' +
                        '<a href="/profile" class="no-underline">Profile</a>' +
                        '<img src="../../images/circle.png" alt="User Icon" class="profile-icon">' +
                      '</div>' +
                    '</div>';