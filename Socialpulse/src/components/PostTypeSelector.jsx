import PropTypes from 'prop-types'
import { Button } from "@/components/ui/button"

export default function PostTypeSelector({ onSelectPostType }) {
  return (
    <div className="flex space-x-4">
      <Button onClick={() => onSelectPostType('carousel')}>Carousel</Button>
      <Button onClick={() => onSelectPostType('reel')}>Reel</Button>
      <Button onClick={() => onSelectPostType('static')}>Static Image</Button>
    </div>
  )
}

PostTypeSelector.propTypes = {
  onSelectPostType: PropTypes.func.isRequired,
}

