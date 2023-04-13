import React, { useState } from 'react';
import {
  Typography,
  Flex,
  Box,
  Field,
  FieldLabel,
  FieldInput,
  IconButton,
  IconButtonGroup
} from '@strapi/design-system';

import { Plus, Trash, ArrowUp, ArrowDown, Pencil, Check } from '@strapi/icons';
import { useIntl } from 'react-intl';

export default function Index({
                                attribute,
                                description,
                                disabled,
                                error,
                                intlLabel,
                                labelAction,
                                name,
                                onChange,
                                required,
                                value,
                              }) {

  const { formatMessage } = useIntl();

  const [newEntry, setNewEntry] = useState('');
  let editValueEntry = '';
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onAddEntry = () => {
    if(!newEntry) return;
    const items = value ? JSON.parse(value) : [];
    items.push(newEntry);
    setNewEntry('');
    onChange({
      target: {
        name: name,
        value: JSON.stringify(items),
        type: attribute.type
      }
    });
  }


  const onMoveEntry = (index: number, direction: string) => {
    let items = value ? JSON.parse(value) : [];
    if(direction === 'up') {
      [ items[index], items[index-1] ] = [ items[index-1], items[index] ];
    } else {
      [ items[index], items[index+1] ] = [ items[index+1], items[index] ];
    }
    onChange({
      target: {
        name: name,
        value: JSON.stringify(items),
        type: attribute.type
      }
    });

  }

  const onRemoveEntry = (event) => {
    const items = value ? JSON.parse(value) : [];
    items.splice(event.target.dataset.index as number, 1);
    onChange({
      target: {
        name: name,
        value: JSON.stringify(items),
        type: attribute.type
      }
    });
  }

  const onEditEntry = (index: number) => {
    if(index === selectedIndex) {
      setSelectedIndex(-1);
      const items = value ? JSON.parse(value) : [];
      items[index] = editValueEntry;
      editValueEntry = '';
      onChange({
        target: {
          name: name,
          value: JSON.stringify(items),
          type: attribute.type
        }
      });
      return;
    }
    setSelectedIndex(index);
  }

  const EditEntryButton  = ({index}) => {
    return index === selectedIndex ? <IconButton background="primary100" onClick={() => onEditEntry(index)} data-index={index} label="Save" icon={<Check aria-hidden />} /> : <IconButton onClick={() => onEditEntry(index)} data-index={index} label="Edit" icon={<Pencil aria-hidden />} />;
  }

  const EntryContent = ({entry, index}) => {
    if(index !== selectedIndex) {
      return <Typography>{entry}</Typography>;
    }
    else {
      return <FieldInput defaultValue={entry} onChange={(e: any) => editValueEntry = e.target.value} id={index + '-input'} placeholder="..." />;
    }
  }

  const DataRecords = () => {
    if(!Array.isArray(JSON.parse(value))) {
      return <Typography>No data entries</Typography>;
    } else {
      return JSON.parse(value).map((entry: string, index: number) => (
        <Box padding={[2]} background="neutral150" shadow="filterShadow" key={index + '-entry'}>
          <Flex alignItems="center" gap={5} justifyContent="space-between">
            <EntryContent index={index} entry={entry} />
            <Flex gap={1}>
              <EditEntryButton index={index} />
              <IconButtonGroup>
                <IconButton disabled={index === 0} onClick={() => onMoveEntry(index, 'up')} data-index={index} label="Move Up" icon={<ArrowUp aria-hidden />} />
                <IconButton disabled={index === JSON.parse(value).length -1} onClick={() => onMoveEntry(index, 'down')} data-index={index} label="Move Down" icon={<ArrowDown aria-hidden />} />
              </IconButtonGroup>
              <IconButton disabled={disabled} onClick={onRemoveEntry} data-index={index} noBorder label="Remove" icon={<Trash aria-hidden />} />
            </Flex>
          </Flex>

        </Box>
      ));
    }
  }

  return (
    <Field
      name={name}
      id={name}
      // GenericInput calls formatMessage and returns a string for the error
      error={error}
      hint={description && formatMessage(description)}
      required={required}
    >
      <Flex direction="column" alignItems="stretch" gap={1}>
        <FieldLabel action={labelAction}>{formatMessage(intlLabel)}</FieldLabel>
        <Box padding={[2]} background="neutral150" shadow="filterShadow">
          <Flex gap={1} justifyContent="space-between">
            <FieldInput value={newEntry} onChange={(e: any) => setNewEntry(e.target.value)} placeholder="Add new entry ..." />
            <Flex gap={1}>
              <IconButton disabled={disabled} onClick={onAddEntry} label="Create" icon={<Plus aria-hidden />} />
            </Flex>
          </Flex>
        </Box>
        <Flex direction="column" alignItems="stretch" justifyContent="center" gap={1}>
          <DataRecords />
        </Flex>
      </Flex>
    </Field>
  )
}
