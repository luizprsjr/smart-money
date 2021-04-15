import React, {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import IEntry from '../../interfaces/Entry';
import {getEntries} from '../../services/Entries';
import Container from '../Core/Container';
import EntryListItem from '../EntryListItem';

interface EntryListProps {
  days?: number;
}

const EntryList: React.FC<EntryListProps> = ({days = 7}) => {
  const navigation = useNavigation();

  const [entries, setEntries] = useState<
    Realm.Results<IEntry & Realm.Object>
  >();

  const loadEntries = useCallback(async () => {
    const data = await getEntries(days);
    setEntries(data);
  }, [days]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadEntries();
    });
    return unsubscribe;
  }, [navigation, loadEntries]);

  return (
    <Container
      title="Últimos lançamentos"
      actionLabelText={`Últimos ${days} dias`}
      actionButtonText="Ver mais"
      onPressActionButton={() => navigation.navigate('Report')}>
      <FlatList // TODO: item.entryAt is Non-serializable value but RealmDB requires a date value
        data={entries}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <EntryListItem
            entry={item}
            isFirstItem={index === 0}
            isLastItem={entries?.length ? index === entries.length - 1 : false}
          />
        )}
      />
    </Container>
  );
};

export default EntryList;
