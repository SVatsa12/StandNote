"""
Make `app` a proper Python package for production imports.

Some modules use `from app import models, schemas`, so we re-export those
packages here for convenience.
"""

from . import models, schemas  # noqa: F401

