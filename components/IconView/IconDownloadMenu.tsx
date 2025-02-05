import { FunctionComponent, useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiDownload, mdiFilePngBox, mdiFileXmlBox } from '@mdi/js';
import { siWindows } from 'simple-icons/icons';

import { IconLibrary, IconLibraryIcon } from '../../interfaces/icons';

import { useAnalytics } from 'use-analytics';

interface IconDownloadMenuMenuProps {
  icon: IconLibraryIcon;
  library: IconLibrary;
};

interface PngDownloadOptions {
  [key: number]: string;
}

const IconDownloadMenu: FunctionComponent<IconDownloadMenuMenuProps> = ({ icon, library }) => {
  const [ menuAnchor, setMenuAnchor ] = useState<null | HTMLElement>(null);
  const [ pngDownloadOptions, setPngDownloadOptions ] = useState<PngDownloadOptions>({});
  const { track } = useAnalytics();

  useEffect(() => {
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${library.gridSize} ${library.gridSize}"><path d="${icon.p}" /></svg>`;
    const svgUrl = URL.createObjectURL(new Blob([svgCode], { type: 'image/svg+xml' }));
    const svgImage = document.createElement('img');
    svgImage.onload = () => {
      const pngOptions = [24, 36, 48].reduce((output: any, size) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(svgImage, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        output[size] = imageData;
        canvas.remove();
        return output;
      }, {});
      setPngDownloadOptions(pngOptions);
      URL.revokeObjectURL(svgUrl);
      svgImage.remove();
    };
    svgImage.src = svgUrl;
  }, [ library.gridSize, icon.p]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const downloadSvg = () => {
    const code = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${library.gridSize} ${library.gridSize}"><title>${icon.n}</title><path d="${icon.p}" /></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(code)}`;
  };

  const downloadPng = (size: number) => pngDownloadOptions[size];

  const downloadXamlCanvas = () => {
    const code = `<Canvas xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Width="${library.gridSize}" Height="${library.gridSize}"><Path Fill="#000000" Data="${icon.p}" /></Canvas>`;
    return `data:application/xaml+xml;charset=utf-8,${encodeURIComponent(code)}`;
  };

  const downloadXamlDrawImage = () => {
    const code = `<DrawingImage xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"><DrawingImage.Drawing><GeometryDrawing Brush="#000000" Geometry="${icon.p}" /></DrawingImage.Drawing></DrawingImage>`;
    return `data:application/xaml+xml;charset=utf-8,${encodeURIComponent(code)}`;
  };

  const downloadXmlVectorDrawable = () => {
    const code = `<!-- drawable/${icon.n.replace('-', '_')}.xml --><vector xmlns:android="http://schemas.android.com/apk/res/android" android:height="${library.gridSize}dp" android:width="${library.gridSize}dp" android:viewportWidth="${library.gridSize}" android:viewportHeight="${library.gridSize}"><path android:fillColor="#000000" android:pathData="${icon.p}" /></vector>`;
    return `data:application/xml;charset=utf-8,${encodeURIComponent(code)}`;
  };

  const buildMenuOptions = () => {
    return [
      <MenuItem
        component='a'
        disabled={!pngDownloadOptions[24]}
        download={`${icon.n}-24\.png`}
        href={downloadPng(24)}
        key='png24'
        onClick={() => track('downloadPNG', { color: '#000000', icon: icon.n, library: library.name, size: 24 })}
      >
        <ListItemIcon><Icon path={mdiFilePngBox} size={1} /></ListItemIcon>
        <ListItemText>Download PNG (24x24)</ListItemText>
      </MenuItem>,
      <MenuItem
        component='a'
        disabled={!pngDownloadOptions[36]}  
        download={`${icon.n}-36\.png`}
        href={downloadPng(36)}
        key='png36'
        onClick={() => track('downloadPNG', { color: '#000000', icon: icon.n, library: library.name, size: 36 })}
      >
        <ListItemIcon><Icon path={mdiFilePngBox} size={1} /></ListItemIcon>
        <ListItemText>Download PNG (36x36)</ListItemText>
      </MenuItem>,
      <MenuItem
        component='a'
        disabled={!pngDownloadOptions[48]}
        download={`${icon.n}-48\.png`}
        href={downloadPng(48)}
        key='png48'
        onClick={() => track('downloadPNG', { color: '#000000', icon: icon.n, library: library.name, size: 48 })}
      >
        <ListItemIcon><Icon path={mdiFilePngBox} size={1} /></ListItemIcon>
        <ListItemText>Download PNG (48x48)</ListItemText>
      </MenuItem>,
      <Divider key='div-1' />,
      <MenuItem
        component='a'
        download={`${icon.n.replace('-', '_')}\.xml`}
        href={downloadXmlVectorDrawable()}
        key='xml'
        onClick={() => track('downloadXML', { icon: icon.n, library: library.name })}
      >
        <ListItemIcon><Icon path={mdiFileXmlBox} size={1} /></ListItemIcon>
        <ListItemText>Download XML Vector Drawable</ListItemText>
      </MenuItem>,
      <Divider key='div-2' />,
      <MenuItem
        component='a'
        download={`${icon.n}\.xaml`}
        href={downloadXamlCanvas()}
        key='xaml-canvas'
        onClick={() => track('downloadXAML', { icon: icon.n, library: library.name, type: 'canvas' })}
      >
        <ListItemIcon sx={{ marginLeft: '4px', marginRight: '-4px' }}><Icon path={siWindows.path} size={.7} /></ListItemIcon>
        <ListItemText>Download XAML (Canvas) for Windows</ListItemText>
      </MenuItem>,
      <MenuItem
        component='a'
        download={`${icon.n}\.xaml`}
        href={downloadXamlDrawImage()}
        key='xaml-drawimage'
        onClick={() => track('downloadXAML', { icon: icon.n, library: library.name, type: 'drawimage' })}
      >
        <ListItemIcon sx={{ marginLeft: '4px', marginRight: '-4px' }}><Icon path={siWindows.path} size={.7} /></ListItemIcon>
        <ListItemText>Download XAML (DrawImage) for Windows</ListItemText>
      </MenuItem>
    ];
  };

  return (
    <div>
      <ButtonGroup>
        <Tooltip arrow placement='top' title='Download SVG'>
          <Button
            download={`${icon.n}\.svg`}
            href={downloadSvg()}
            onClick={() => track('downloadSvg', { icon: icon.n, library: library.name })}
            sx={{ borderRadius: '4px 0 0 4px' }}
            variant='contained'
          >
            <Icon path={mdiDownload} size={1} />
          </Button>
        </Tooltip>
        <Tooltip arrow placement='top' title='Advanced Download'>
          <Button
            aria-controls={!!menuAnchor ? 'download-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={!!menuAnchor ? 'true' : undefined}
            aria-label='Advanced Download'
            disableRipple
            id='download-menu-button'
            onClick={handleMenuClick}
            sx={{
              borderLeft: '1px solid hsl(var(--white) / 25%)',
              borderRadius: '0 4px 4px 0',
              padding: '0 .5rem'
            }}
            variant='contained'
          >
            <Icon path={mdiChevronDown} size={1} />
          </Button>
        </Tooltip>          
      </ButtonGroup>
      <Menu
        anchorEl={menuAnchor}
        id='download-menu'
        MenuListProps={{
          'aria-labelledby': 'download-menu-button'
        }}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuList dense>{buildMenuOptions()}</MenuList>
      </Menu>
    </div>
  );
};

export default IconDownloadMenu;
