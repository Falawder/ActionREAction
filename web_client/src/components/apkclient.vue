<script>
export default {
  props: {
    msg: String
},
data() {
    return {
      url:'http://localhost:8080/client.apk'
    }
  },
mounted: function () {
    location.replace(this.url)
    }
}
</script>
