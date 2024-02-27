import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const DH = (height: number) => {
  return hp(height); //Dynamic Height
};

export const DW = (width: number) => {
  return wp(width); //Dynamic Width
};
