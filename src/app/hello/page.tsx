import HelloWorld from '@/components/HelloWorld'

const HelloWorldPage = () => {
  return (
    <main>
      <HelloWorld message="hello" data-test="true">
        <i>children</i>
      </HelloWorld>
    </main>
  )
}

export default HelloWorldPage
