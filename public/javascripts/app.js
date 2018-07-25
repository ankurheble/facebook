(function() {
  $(".like-btn").on("click", function(event) {
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

  $(".create-post").on('click',function(event){
    event.preventDefault();

    const postContent = $(this).closest(".card-footer").closest(".card").find("textarea").val();
    $(this).closest(".card-footer").closest(".card").find("textarea").val('');
    $.ajax({
      url: "/posts",
      type: "POST",
      data: {"post": postContent},
      success: function(response){
        let newPost ='<div class="posts"><div class="post"><div class="card"><div class="card-body"><div class="flex align-end"><img src="https://picsum.photos/40/40" class="img-circle" /><div class="flex column ml-2"><p class="mb-0 text-primary">'+response.post.user.name+'</p><p class="text-muted text-sm">'+response.post.user.createdAt+'</p></div></div><div class="flex column"><p>'+response.post.content+'</p><hr/></div><div class="flex"><span class="text-warning mr-2" id="likes-'+response.post.id+'">'+response.post.likes+' Likes</span><a class="no-anchor-color fa fa-thumbs-up m-auto like-btn" href="#" data-id="'+response.post.id+'" data-resource-type="post"> Like</a><a class="no-anchor-color fa fa-comment m-auto" href="#">Comment</a><a class="no-anchor-color fa fa-share-square m-auto" href="#">Share</a><hr/></div><div class="comments"><ul class="list-group"></ul></div><div class="card-footer bg-transparent"><form method="POST" action="/posts/' + response.post.id + '/comments"><div class="flex align-center"><img class="comment-pic img-circle mr-2" src="https://picsum.photos/30/30" /><input class="form-control comment-box" type="text" placeholder="Write a comment..." name="comment" style="height:30px" /></div></form></div></div></div></div></div>';
        $(".posts").prepend(newPost);
      }
    });
  });
})();
