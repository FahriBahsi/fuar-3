'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import SocialInfoField from './SocialInfoField';

interface SocialField {
  id: string;
  platform: string;
  url: string;
}

interface SocialInfoManagerProps {
  onFieldsChange?: (fields: SocialField[]) => void;
}

export default function SocialInfoManager({ onFieldsChange }: SocialInfoManagerProps) {
  const [socialFields, setSocialFields] = useState<SocialField[]>([
    {
      id: 'social-1',
      platform: '',
      url: '',
    },
  ]);

  const handleAddField = () => {
    const newField: SocialField = {
      id: `social-${Date.now()}`,
      platform: '',
      url: '',
    };
    const updatedFields = [...socialFields, newField];
    setSocialFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  const handleRemoveField = (id: string) => {
    const updatedFields = socialFields.filter((field) => field.id !== id);
    setSocialFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  const handlePlatformChange = (id: string, platform: string) => {
    const updatedFields = socialFields.map((field) =>
      field.id === id ? { ...field, platform } : field
    );
    setSocialFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  const handleUrlChange = (id: string, url: string) => {
    const updatedFields = socialFields.map((field) =>
      field.id === id ? { ...field, url } : field
    );
    setSocialFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const items = Array.from(socialFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSocialFields(items);
    onFieldsChange?.(items);
  };

  return (
    <div className="social-info-manager">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="social-fields">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              id="social_info_sortable_container"
              className={`sortable-container ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
            >
              {socialFields.map((field, index) => (
                <SocialInfoField
                  key={field.id}
                  id={field.id}
                  index={index}
                  platform={field.platform}
                  url={field.url}
                  onPlatformChange={handlePlatformChange}
                  onUrlChange={handleUrlChange}
                  onRemove={handleRemoveField}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        type="button"
        className="copy-btn btn btn-sm btn-secondary"
        onClick={handleAddField}
        style={{ marginTop: '15px' }}
      >
        <i className="la la-plus"></i> Add New
      </button>
    </div>
  );
}
