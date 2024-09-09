// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Story, Fatrows, PresentionChart, People, Activity } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart,
  people: People,
  unity: Activity
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const widget: NavItemType = {
  id: 'group-widget',
  // title: <FormattedMessage id="widgets" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'distributors',
      title: <FormattedMessage id="Distribuidoras" />,
      type: 'item',
      url: '/distribuidoras',
      icon: icons.statistics,
      breadcrumbs: false
    },
    {
      id: 'data',
      title: <FormattedMessage id="Clientes" />,
      type: 'item',
      url: '/clientes',
      icon: icons.people,
      breadcrumbs: false
    },
    {
      id: 'geradores',
      title: <FormattedMessage id="Geradores" />,
      type: 'item',
      url: '/geradores',
      icon: icons.chart,
      breadcrumbs: false
    },
    {
      id: 'usinas',
      title: <FormattedMessage id="Usinas" />,
      type: 'item',
      url: '/usinas',
      icon: icons.data,
      breadcrumbs: false
    },
    {
      id: 'unidades-consumidoras',
      title: <FormattedMessage id="Unidades consumidoras" />,
      type: 'item',
      url: '/unidades-consumidoras',
      icon: icons.unity,
      breadcrumbs: false
    }
  ]
};

export default widget;
