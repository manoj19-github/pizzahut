import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  body: {
    fontFamily: '"Lato",sans-serif',
    WebkitFontSmoothing: 'antiliased'
  },
  'nav menuList li:last-child a': {
    background: '#fe5f1e'
  },
  'nav menuList li:last-child a:hover': {
    backgroundColor: '#b23301'
  },
  'nav menuList li a': {
    transition: 'all 0.4s ease-in-out'
  },
  'nav menuList li a:hover': {
    color: '#fe5f1e'
  },
  sectionhero: {
    background: '#f8f8f8'
  },
  size: {
    background: '#f8f8f8'
  },
  'add-to-cart': {
    border: [{ unit: 'px', value: 2 }, { unit: 'string', value: 'solid' }, { unit: 'string', value: '#fe5f1e' }],
    borderRadius: '2rem',
    transition: 'all 0.4s ease-in-out'
  },
  'add-to-cart:hover': {
    background: '#fe5f1e',
    borderColor: '#fff',
    color: '#fff'
  },
  'btn-primary': {
    background: '#fe5f1e',
    color: '#fff',
    transition: 'all 0.4s ease-in-out'
  },
  'btn-primary fa-angle-double-left': {
    transition: 'all 0.4s ease-in-out'
  },
  'btn-primary:hover': {
    background: '#b23301'
  },
  'btn-primary:hover fa-angle-double-left': {
    transform: 'translateX(-30px)'
  },
  cart: {
    background: '#f8f8f8'
  },
  amount: {
    color: '#fe5f1e'
  },
  sectionlogin: {
    background: '#f8f8f8',
    minHeight: [{ unit: 'vh', value: NaN }]
  }
});
