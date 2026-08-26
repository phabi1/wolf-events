import { useState, useMemo, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router';

export type PageAction = {
    label: string,
    to?: string,
    handle?: () => void;
    primary?: boolean
}

export type UiPageProps = PropsWithChildren<{
    title?: string,
    subtitle?: string,
    actions: PageAction[];
}>;

function UiPageHeader({ title, subtitle, actions = [] }: {
    title?: string,
    subtitle?: string;
    actions: PageAction[]
}) {
    const [openMenu, setOpenMenu] = useState(false);

    const primaryActions = useMemo(() => actions.filter(action => action.primary)
        , [actions]);

    const secondaryActions = useMemo(() => actions.filter(action => !!action.primary)
        , [actions]);

    return <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}
    >
        <div>
            {title && <h1>{title}</h1>}
            {subtitle && <h2>{subtitle}</h2>}
        </div>
        <div>
            {primaryActions.length > 0 && primaryActions.map((action) => (
                action.to ? (
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={action.to}
                    >
                        {action.label}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={action.handle}
                    >
                        {action.label}
                    </Button>
                )
            ))}
            {secondaryActions.length > 0 && <>
                <IconButton
                    color="primary"
                    aria-controls="page-menu"
                    aria-haspopup="true"
                    onClick={() => {setOpenMenu(true)}}
                    sx={{ marginLeft: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="page-menu"
                    open={openMenu}
                    anchorEl={null}
                    onClose={() => {
                        setOpenMenu(false);
                    }}
                >
                    {secondaryActions.map(action =>
                        action.to ? (
                            <MenuItem
                                component={Link}
                                to={action.to}
                            >
                                {action.label}
                            </MenuItem>
                        ) : (
                            <MenuItem
                                onClick={action.handle}
                            >
                                {action.label}
                            </MenuItem>
                        )
                    )}
                </Menu>
            </>
            }
        </div>
    </Box>;
}

export default function UiPage({ title, subtitle, actions, children }: UiPageProps) {

    return <Box>
        <UiPageHeader title={title} subtitle={subtitle} actions={actions} />
        <Box>
            {children}
        </Box>
    </Box>;
}