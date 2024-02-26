import { ChangeCircleOutlined } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Chinese converter',
  path: '/chinese-converter',
  description: 'Conversion between simplified chinese and traditional chinese',
  keywords: [
    'chinese',
    'converter',
    'simplified',
    'traditional',
  ],
  component: () => import('./chinese-converter.vue'),
  icon: ChangeCircleOutlined,
});