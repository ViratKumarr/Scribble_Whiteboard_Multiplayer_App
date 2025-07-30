import React from 'react';
import { DrawingTool } from '../types';

interface ToolSettings {
  color: string;
  lineWidth: number;
  tool: DrawingTool;
}

interface ToolPanelProps {
  settings: ToolSettings;
  onSettingsChange: (settings: ToolSettings) => void;
}

/**
 * ToolPanel component for selecting drawing tools and settings
 */
const ToolPanel: React.FC<ToolPanelProps> = ({ settings, onSettingsChange }) => {
  const handleToolChange = (tool: ToolSettings['tool']) => {
    onSettingsChange({ ...settings, tool });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, color: e.target.value });
  };

  const handleLineWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, lineWidth: parseInt(e.target.value) });
  };

  return (
    <div className="tool-panel">
      <h3 className="panel-title">Drawing Tools</h3>
      
      <div className="tool-section">
        <h4 className="section-title">Tools</h4>
        <div className="tool-buttons">
          <button
            className={`tool-button ${settings.tool === DrawingTool.PEN ? 'active' : ''}`}
            onClick={() => handleToolChange(DrawingTool.PEN)}
            title="Pen Tool"
          >
            ✏️
          </button>
          <button
            className={`tool-button ${settings.tool === DrawingTool.ERASER ? 'active' : ''}`}
            onClick={() => handleToolChange(DrawingTool.ERASER)}
            title="Eraser Tool"
          >
            🧽
          </button>
          <button
            className={`tool-button ${settings.tool === DrawingTool.LINE ? 'active' : ''}`}
            onClick={() => handleToolChange(DrawingTool.LINE)}
            title="Line Tool"
          >
            ⁄
          </button>
          <button
            className={`tool-button ${settings.tool === DrawingTool.RECTANGLE ? 'active' : ''}`}
            onClick={() => handleToolChange(DrawingTool.RECTANGLE)}
            title="Rectangle Tool"
          >
            □
          </button>
          <button
            className={`tool-button ${settings.tool === DrawingTool.CIRCLE ? 'active' : ''}`}
            onClick={() => handleToolChange(DrawingTool.CIRCLE)}
            title="Circle Tool"
          >
            ○
          </button>
        </div>
      </div>
      
      <div className="tool-section">
        <h4 className="section-title">Color</h4>
        <input
          type="color"
          value={settings.color}
          onChange={handleColorChange}
          className="color-picker"
        />
        <div className="color-presets">
          <button 
            className="color-preset" 
            style={{ backgroundColor: '#000000' }}
            onClick={() => onSettingsChange({ ...settings, color: '#000000' })}
          />
          <button 
            className="color-preset" 
            style={{ backgroundColor: '#FF0000' }}
            onClick={() => onSettingsChange({ ...settings, color: '#FF0000' })}
          />
          <button 
            className="color-preset" 
            style={{ backgroundColor: '#00FF00' }}
            onClick={() => onSettingsChange({ ...settings, color: '#00FF00' })}
          />
          <button 
            className="color-preset" 
            style={{ backgroundColor: '#0000FF' }}
            onClick={() => onSettingsChange({ ...settings, color: '#0000FF' })}
          />
          <button 
            className="color-preset" 
            style={{ backgroundColor: '#FFFF00' }}
            onClick={() => onSettingsChange({ ...settings, color: '#FFFF00' })}
          />
        </div>
      </div>
      
      <div className="tool-section">
        <h4 className="section-title">Line Width</h4>
        <input
          type="range"
          min="1"
          max="20"
          value={settings.lineWidth}
          onChange={handleLineWidthChange}
          className="line-width-slider"
        />
        <div className="line-width-value">{settings.lineWidth}px</div>
      </div>
    </div>
  );
};

export default ToolPanel;