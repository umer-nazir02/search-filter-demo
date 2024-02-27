import React, {useCallback, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useProductTree} from './ContextProvider';
import CheckBox from '@react-native-community/checkbox';
import {DW} from '../utils/responsive';

const TreeItem = React.memo(({item}: any) => {
  const {selectedItems, toggleItem} = useProductTree();
  const [expanded, setExpanded] = useState(false);

  const handlePress = useCallback(() => {
    if (item.children) {
      setExpanded(prevExpanded => !prevExpanded);
    }
  }, [item, selectedItems]);
  const isItemSelected = selectedItems.includes(item);
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.checkBoxWrapper}>
          <CheckBox
            value={isItemSelected}
            onValueChange={toggleItem.bind(null, item)}
            boxType="square"
            onFillColor="#ffffff"
            onTintColor="#000"
            lineWidth={1}
            tintColor="#000"
            onCheckColor="#000"
          />
        </View>
        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <Text style={styles.textLarge}>{item.name}</Text>
          {!expanded && item.itemCount > 0 && (
            <Text style={styles.textSmall}>{`+${item.itemCount} Devices`}</Text>
          )}
        </TouchableOpacity>
      </View>
      {expanded && item.children && (
        <View style={styles.childrenWrapper}>
          {item.children.map((childItem: IItem) => (
            <TreeItem key={childItem.name} item={childItem} />
          ))}
        </View>
      )}
    </View>
  );
});

const ProductTree = ({data}: any) => (
  <View>
    {data.map((item: IItem) => (
      <TreeItem key={item.name} item={item} />
    ))}
  </View>
);

export default ProductTree;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  checkBoxWrapper: {
    backgroundColor: '#fff',
  },
  button: {
    paddingLeft: 20,
  },
  textLarge: {
    fontSize: DW(5),
  },
  textSmall: {
    fontSize: DW(3),
  },
  childrenWrapper: {
    marginLeft: 20,
  },
});
