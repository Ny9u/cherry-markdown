<script>
  import NavBar from "./components/NavBar.svelte";
  import NavMenu from "./components/NavMenu.svelte";
  import Content from "./components/Content.svelte";
</script>

<main>
  <div>
    <NavBar/>
    <div class="container">
      <NavMenu/>
      <Content/>
    </div>
  </div>
</main>

<style>
.container {
  width: 100%;
  display: flex;
  flex-direction: row;
}
</style>

