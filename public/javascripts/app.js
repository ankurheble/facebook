(function() {
  $(document.body).on("click", ".like-btn", function(event) {
    event.preventDefault();

    const resource = $(this).data("resource-type");
    const id = $(this).data("id");
    const concatenatedId = "#likes-" + id;

    switch (resource) {
      case "comment":
        $.ajax({
          url: `/comments/${id}/likes`,
          type: "POST",
          success: function(response) {
            $(concatenatedId).text(response.likes + " Likes");
          }
        });
        break;
      case "post":
        $.ajax({
          url: `/posts/${id}/likes`,
          type: "POST",
          success: function(response) {
            $(concatenatedId).text(response.likes + " Likes");
          }
        });
        break;
      default:
        break;
    }
  });

  $(document.body).on("click", ".create-post", function(event) {
    event.preventDefault();

    const postContent = $(this)
      .closest(".card-footer")
      .closest(".card")
      .find("textarea")
      .val();
    $(this)
      .closest(".card-footer")
      .closest(".card")
      .find("textarea")
      .val("");
    $.ajax({
      url: "/posts",
      type: "POST",
      data: { post: postContent },
      success: function(response) {
        let newPost = `<div class="post">
              <div class="card">
                  <div class="card-body">
                      <div class="flex align-end">
                          <img src="https://picsum.photos/40/40" class="img-circle" />
                          <div class="flex column ml-2">
                              <p class="mb-0 text-primary">${
                                response.user.name
                              }</p>
                              <p class="text-muted text-sm">${
                                response.user.createdAt
                              }</p>
                          </div>
                      </div>
                      <div class="flex column">
                          <p>${response.post.content}</p>
                      </div>
                      <hr/>
                      <div class="flex">
                          <span class="text-warning mr-2" id="likes-${
                            response.post._id
                          }">${response.post.likes} Likes</span>
                          <a class="no-anchor-color fa fa-thumbs-up m-auto like-btn" href="#" data-id="${
                            response.post._id
                          }"
                              data-resource-type="post"> Like</a>
                          <a class="no-anchor-color fa fa-comment m-auto" href="#">Comment</a>
                          <a class="no-anchor-color fa fa-share-square m-auto" href="#">Share</a>
                      </div>
                      <hr/>
                      <div class="comments">
                          <ul class="list-group" data-id=${
                            response.post._id
                          }></ul>
                      </div>
                  </div>
                  <div class="card-footer bg-transparent">
                      <form method="POST" class="comment-form" data-id=${
                        response.post._id
                      }>
                          <div class="flex align-center">
                              <img class="comment-pic img-circle mr-2" src="https://picsum.photos/30/30" />
                              <input type="hidden" value=${response.post._id} />
                              <input class="form-control comment-box" type="text" placeholder="Write a comment..." name="comment" style="height:30px"/>
                          </div>
                      </form>
                  </div>
              </div>
          </div>`;
        $(".posts").prepend(newPost);
      }
    });
  });

  $(document.body).on("submit", ".comment-form", function(event) {
    event.preventDefault();
    let postId = $(this).data("id");
    let content = $(this)
      .find(".comment-box")
      .val();
    $(this)
      .find(".comment-box")
      .val("");
    let submitURL = "/posts/" + postId + "/comments";
    $.ajax({
      url: submitURL,
      type: "POST",
      data: { comment: content },
      success: function(response) {
        let newComment = `<li class="list-group-item no-border">
            <div class="flex">
                <img class="comment-pic img-circle" src="https://picsum.photos/30/30" />
                <div class="flex column ml-2">
                    <p class="mb-0 ml-2 comment-content">${
                      response.comment.content
                    }</p>
                    <div class="ml-2 flex">
                        <span class="text-warning mr-2 text-sm" id=likes-${
                          response.comment._id
                        }>${response.comment.likes} Likes</span>
                        <a class="text-sm no-underline like-btn" href="#" data-id=${
                          response.comment._id
                        }
                            data-resource-type="comment">Like</a>
                        <p class="text-sm ml-2 text-muted">${
                          response.comment.createdAt
                        }</p>
                    </div>
                </div>
            </div>
        </li>`;
        $(`ul.list-group[data-id=${response.post._id}]`).append(newComment);
      }
    });
  });
})();
