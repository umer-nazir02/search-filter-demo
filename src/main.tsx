import {ScrollView, StyleSheet, Text, View} from 'react-native';
import ProductTree from './components/TreeViewNode';
import {productTreeData} from './utils/mock';
import {useProductTree} from './components/ContextProvider';
import React from 'react';
import {DH, DW} from './utils/responsive';

const RenderSelectedItems = () => {
  const {selectedItems} = useProductTree();
  // Function to group the selected items by parent
  const groupByParent = (items: IItem[]): {[key: string]: IItem} => {
    return items.reduce<{[key: string]: IItem}>((acc, item: IItem) => {
      const key = item.parent || item.name;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          parentName: item.parentName,
          children: [],
        };
      }
      acc[key].children.push(item.name);
      return acc;
    }, {});
  };
  // Group selected variants by parent
  const groupedByParent = React.useMemo(
    () =>
      groupByParent(
        selectedItems.filter((item: IItem) => item.type === 'Variant'),
      ),
    [selectedItems],
  );
  // Filter items if Varients
  const nonVariantItems = React.useMemo(
    () => selectedItems.filter((item: IItem) => item.type !== 'Variant'),
    [selectedItems],
  );
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Selected Variants</Text>
      <View style={styles.selectedVariantContainer}>
        {Object.entries(groupedByParent).map(
          ([parent, {children, parentName}]) => (
            <View style={styles.variantGroup} key={parent}>
              <Text style={styles.variantText}>
                {parentName}: {children.join(', ')}
              </Text>
            </View>
          ),
        )}
        {nonVariantItems.map((item: IItem, index: number) => (
          <View style={styles.variantItem} key={index}>
            <Text style={styles.variantText}>all {item.name} devices</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const Main = () => {
  return (
    <ScrollView nestedScrollEnabled>
      <Text style={styles.headerText}>Browse Products</Text>
      <View style={styles.productContainer}>
        <ScrollView>
          <ProductTree data={productTreeData} />
        </ScrollView>
      </View>
      <View>
        <RenderSelectedItems />
      </View>
    </ScrollView>
  );
};

export default Main;

const styles = StyleSheet.create({
  headerText: {
    fontSize: DW(5),
    fontWeight: 'bold',
    paddingHorizontal: DW(2),
    paddingBottom: DW(3),
  },
  productContainer: {
    paddingVertical: DW(5),
    borderWidth: 2,
    borderColor: 'blue',
    paddingHorizontal: DW(2),
    marginHorizontal: DW(1),
    height: DH(60),
    backgroundColor: '#C4C4C4',
  },
  container: {
    backgroundColor: 'white',
    padding: 10,
    paddingTop: DW(5),
  },
  titleText: {
    fontSize: DW(5),
    fontWeight: '500',
  },
  selectedVariantContainer: {
    flexDirection: 'row',
    gap: DW(2),
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingTop: DW(2),
    alignContent: 'center',
  },
  variantGroup: {
    paddingHorizontal: DW(2),
    backgroundColor: '#C4C4C4',
    padding: DW(2),
  },
  variantText: {
    fontSize: DW(4),
  },
  variantItem: {
    padding: DW(2),
    backgroundColor: '#C4C4C4',
  },
  selectedVariantText: {
    fontSize: 16,
    color: '#000',
    marginRight: 5,
  },
  variantGroupText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    marginRight: 5,
  },
});
