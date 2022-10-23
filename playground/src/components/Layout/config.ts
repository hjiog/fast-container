export const warnTipsMap: Record<
  string,
  Partial<{ msg: string; question: string; success: string }>
> = {
  basic: {
    msg: '表现：输入框的更改会影响到所有组件',
  },
  memo: {
    msg: '具体操作：给每个组件外面都包裹上了 memo',
    question: '思考🤔：Form 组件都跳过执行了，为啥作为 Form 的子组件还是会执行',
    success: '结果：两个 Form 组件不再会重复渲染了',
  },
  subscribe: {
    msg: '具体操作采用发布订阅的模式，将更新操作放在数据可能会变化的子组件中做',
    success: '结果：Card 和 Form 组件都不会重新渲染了，还剩下 Input 组件',
  },
  selector: {
    msg: '具体操作：给订阅中的子组件添加选择器功能，只更新自己关心的那部分数据',
    success:
      '结果：在性能上已经达成预期，但对开发体验不是那么友好，每次都需要写烦人的 selector',
  },
  auto: {
    msg: '具体操作：使用 Proxy 代理自动完成选择器的功能',
    success: '结果：至此我们兼顾了开发体验和用户体验，完结撒花~~🎉🎉🎉~~',
  },
};
