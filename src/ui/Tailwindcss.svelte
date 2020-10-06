<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .text-shadow {
    text-shadow: black 1px 1px;
  }

  .center {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }

  button {
      transition: background 200ms, opacity 200ms;
  }

  button[disabled] {
      opacity: .35;
      pointer-events: none;
  }

  * {
      box-sizing: border-box;
  }
</style>
