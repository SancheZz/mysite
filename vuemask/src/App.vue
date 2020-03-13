<template>
  <div id="app">
    <!-- phone -->
    <label class="form-label">
      <h3 class="form-label__title">
        Phone number
      </h3>

      <vue-mask
        :value.sync="phone"
        type="number"
        mask="+47 ### ## ###"
        class="phone"
      ></vue-mask>
    </label>

    <!-- card -->
    <label class="form-label">
      <h3 class="form-label__title">
        Card number
      </h3>

      <vue-mask
        :value.sync="card"
        type="number"
        mask="first ####  second ####  third ####  fourth ####"
        class="card"
        always-visible-mask
      ></vue-mask>
    </label>
  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      phone: undefined,
      card: undefined,
    };
  },
}
</script>

<style lang="scss" scoped>
.form-label {
  display: block;
  padding: 20px;

  &__title {
    margin: 0 0 10px 0;
    font-weight: normal;
  }
}

.phone {
  --mask-padding: 5px 10px;

  border: 2px solid black;
  border-radius: 4px;
  transition: border-color .1s ease-out;

  &:focus-within {
    border-color: blue;
  }
}

.card {
  --mask-padding: 5px 10px;
  --mask-controlled-color: pink;
  --mask-uncontrolled-color: gray;

  border: 2px solid black;
  border-radius: 4px;
  transition: border-color .1s ease-out;

  &:focus-within {
    border-color: blue;
  }
}
</style>
