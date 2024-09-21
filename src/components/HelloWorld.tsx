import { ReactNode, HTMLAttributes } from 'react'

interface HelloWorldProps extends HTMLAttributes<HTMLDivElement> {
  message?: string
  children?: ReactNode
}

const HelloWorld = ({
  message = 'Hello World',
  children,
  ...props
}: HelloWorldProps) => {
  return (
    <div {...props}>
      <h1>{message}</h1>
      {children}
    </div>
  )
}

export default HelloWorld
