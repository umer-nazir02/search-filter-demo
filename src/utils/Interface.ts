interface IItem {
  name: string;
  itemCount: number;
  type: string;
  parent: number | null;
  parentName: string;
  child: boolean;
  isSelected: boolean;
  id: number;
  children: IItem[];
}
