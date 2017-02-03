<template>
  <div id="register" class="container">
    <h3 class="login-text lead">Register and start learning quickly!</h3>
    <div class="login-section row">
      <section class="col-md-3 col-md-offset-3">
        <div class="login-panel panel panel-default panel-success">
          <div class="panel-body">
            <form>
              <div class="form-group">
                <label for="login">Login</label>
                <input type="email" class="form-control" id="login" placeholder="Enter login">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Enter password">
              </div>
              <button type="submit" class="btn btn-default btn-block">Submit</button>
            </form>
          </div>
        </div>
      </section>
      <section class="socials col-md-3">
        <div class="panel panel-default panel-success">
          <div class="panel-body">
            <p>Or log in through socials:</p>
            <a href="/profile/vk"><img class="vk-image" src="../assets/vk-logo.png"></div></a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>

</script>

<style>
.login-text {
  font-size: 1.5rem;
  margin-top: 5%;
  text-align: center;
}
.login-section {
  margin-top: 10%;
}

.vk-image {
  width: 50px;
  height: 50px;
}
</style>
