import React from 'react'
import { Layoutprops } from '../../../../components/shared/schema/Layout'

const layout = ({children}:Layoutprops) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default layout