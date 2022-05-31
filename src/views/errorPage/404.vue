<template>
  <div class="not-container">
    <img src="/src/assets/error/404.png" class="not-img" alt="404" />
    <div class="not-detail">
      <h2>404</h2>
      <h4>抱歉，您访问的页面不存在~🤷‍♂️🤷‍♀️</h4>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .not-img {
    margin-right: 120px;
  }

  .not-detail {
    display: flex;
    flex-direction: column;

    h2 {
      color: #434e59;
      font-size: 60px;
      font-weight: bold;
      margin-bottom: 30px;
    }

    h4 {
      color: #848587;
      font-size: 19px;
      margin-bottom: 20px;
    }

    .el-button {
      width: 100px;
    }
  }
}
</style>
