<template>
  <div id="lending">
    <header>
      <nav>
        <div class="nav-title">
          JS Courses
        </div>
        <div class="right-nav">
          <ul>
            <li>
              <router-link to="/login" class="nav-link btn btn-link btn-link-yellow">Login</router-link>
            </li>
            <li>
              <router-link to="/register" class="nav-link btn btn-link btn-link-yellow">Register</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <main>
      <div class="container">
        <p class="title">JS Courses</p>
        <p class="description">Platform, where you can learn variety JS frameworks and libraries, <br> and develop your own courses</p>
        <router-link to="/courses" class="btn btn-lg btn-yellow btn-start">Start learning</router-link>
      </div>
    </main>
    <footer>
      
    </footer>
  </div>
</template>

<style scoped>
  nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: .5rem 1rem;
  }
  .nav-title {
    font-size: 1.25rem;
  }
  nav .right-nav {
    height: 100%;
    float: right;
  }
  nav ul {
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: 0;
    list-style: none;
    line-height: 30px;
  }
  nav ul li {
    flex-grow: 1;
    text-align: center;
  }
  .nav-link {
    font-size: 1rem;
    padding-right: 1rem;
    padding-left: 1rem;
    text-decoration: none;
    /*color: rgba(0, 0, 0, 0.9);*/
    padding: 0.3em 1em;
  }
  .nav-link:hover {
    text-decoration: none;
    /*color: rgba(0, 0, 0, 0.5);*/
  }
  main {
    position: relative;
    padding: 6rem 15px;
    color: #cdbfe3;
    text-align: center;
    background-image: linear-gradient(135deg,#271b38,#563d7c,#7952b3);
  }
  main p {
    margin: 0;
  }
  main .title {
    color: white;
    font-size: 2.4rem;
    font-weight: 300;
  }
  main .description {
    color: white;
    font-size: 1.5rem;
    font-weight: 300;
    padding: 1rem 0 3rem;
  }
  .btn-start {
    font-weight: 500;
    font-size: 1.25rem;
    padding: 1rem 2rem;
  }
</style>