# -*- mode: python ; coding: utf-8 -*-
# Build:  cd agent && powershell -File build-package.ps1

import pathlib

from PyInstaller.utils.hooks import collect_all

agent_dir = pathlib.Path(SPECPATH).resolve()

_winpty_datas, _winpty_binaries, _winpty_hidden = collect_all("winpty")

a = Analysis(
    [str(agent_dir / "src" / "main.py")],
    pathex=[str(agent_dir)],
    binaries=_winpty_binaries,
    datas=[
        (str(agent_dir / "scripts" / "parse-ps-complete.ps1"), "scripts"),
        (str(agent_dir / "console-agent.json"), "."),
    ]
    + _winpty_datas,
    hiddenimports=[
        "engineio.async_drivers.aiohttp",
        "engineio.async_drivers.asgi",
        "winpty",
    ]
    + _winpty_hidden,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name="ConsoleAgent",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
