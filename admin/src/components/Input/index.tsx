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

import { Plus, Trash, ArrowUp, ArrowDown } from '@strapi/icons';
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
    const changeValuePosition = (arr, init, target) => {[arr[init],arr[target]] = [arr[target],arr[init]]; return arr}
    console.log(index);
    console.log(items);
    if(direction === 'up') {
      [ items[index], items[index-1] ] = [ items[index-1], items[index] ];
    } else {
      [ items[index], items[index+1] ] = [ items[index+1], items[index] ];
    }
    console.log(items);
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
    console.log(event.target);
    items.splice(event.target.dataset.index as number, 1);
    onChange({
      target: {
        name: name,
        value: JSON.stringify(items),
        type: attribute.type
      }
    });
  }

  const DataRecords = () => {
    if(!Array.isArray(JSON.parse(value))) {
      return <Typography>No data entries</Typography>;
    } else {
      return JSON.parse(value).map((entry: string, index: number) => (
        <Box padding={[2]} background="neutral150" shadow="filterShadow" key={index + '-entry'}>
          <Flex alignItems="center" gap={5} justifyContent="space-between">
            <Typography>{entry}</Typography>
            <Flex gap={1}>
              <IconButtonGroup>
                <IconButton disabled={index === 0} onClick={() => onMoveEntry(index, 'up')} data-index={index} label="Create" icon={<ArrowUp aria-hidden />} />
                <IconButton disabled={index === JSON.parse(value).length -1} onClick={() => onMoveEntry(index, 'down')} data-index={index} label="Create" icon={<ArrowDown aria-hidden />} />
              </IconButtonGroup>
              <IconButton disabled={disabled} onClick={onRemoveEntry} data-index={index} noBorder label="Create" icon={<Trash aria-hidden />} />
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
