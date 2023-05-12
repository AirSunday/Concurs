<template>
  <div class="goPrev">
    <img :src="require(`@/components/images/prev.png`)" @click="$router.push(path)"/>
  </div>
</template>

<script>
export default {
  name: "GoPrev",
  props: {
    path: {
      type: String,
    }
  }
}
</script>

<style scoped>
.goPrev{
  position: fixed;
  top: 20px;
  left: 40px;
  z-index: 7;
}

.goPrev img{
  width: 50px;
  height: auto;
}

.goPrev img:hover{
  cursor: pointer;
  opacity: 0.5;
}

</style>
