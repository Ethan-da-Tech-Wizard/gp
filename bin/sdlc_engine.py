#!/usr/bin/env python3
"""
Master SDLC Lifecycle Orchestrator CLI for Arizona Mobile Software
Orchestrates scaffolding, automated testing, production builds, release packaging, and deployment specs.
"""

import sys
import os
import shutil
import argparse
import subprocess
import json
import tarfile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
DEPLOYMENTS_DIR = os.path.join(BASE_DIR, "deployments")

def run_cmd(cmd, cwd=BASE_DIR):
    print(f"🔧 Running: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    res = subprocess.run(cmd, shell=isinstance(cmd, str), cwd=cwd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"❌ Error (exit {res.returncode}):\n{res.stderr}")
        return False, res.stderr
    return True, res.stdout

def cmd_scaffold(args):
    client_name = args.client.strip().lower().replace(" ", "_")
    template_name = args.template
    
    src_dir = os.path.join(TEMPLATES_DIR, template_name)
    if not os.path.exists(src_dir):
        print(f"❌ Template '{template_name}' does not exist in {TEMPLATES_DIR}")
        return
    
    target_dir = os.path.join(DEPLOYMENTS_DIR, f"client_{client_name}")
    if os.path.exists(target_dir):
        if not args.force:
            print(f"⚠️ Target deployment '{target_dir}' already exists. Use --force to overwrite.")
            return
        shutil.rmtree(target_dir)

    shutil.copytree(src_dir, target_dir)
    print(f"✅ Successfully scaffolded client '{args.client}' from '{template_name}' -> {target_dir}")
    print(f"   Deployment ready at: {target_dir}")

def cmd_test(args):
    print("🧪 Running SDLC Automated Test Suites...")
    passed = True
    
    # 1. Quote Portal server tests
    qp_test_path = os.path.join(TEMPLATES_DIR, "quote-portal", "test_server.py")
    if os.path.exists(qp_test_path):
        ok, out = run_cmd([sys.executable, qp_test_path])
        if ok:
            print("  ✅ Quote Portal server unit tests: PASSED")
        else:
            print("  ❌ Quote Portal server unit tests: FAILED")
            passed = False
            
    # 2. Ops Cleaner tests
    cleaner_test_path = os.path.join(TEMPLATES_DIR, "ops-cleaner", "test_cleaner.py")
    if os.path.exists(cleaner_test_path):
        ok, out = run_cmd([sys.executable, cleaner_test_path])
        if ok:
            print("  ✅ Ops Cleaner unit tests: PASSED")
        else:
            print("  ❌ Ops Cleaner unit tests: FAILED")
            passed = False

    if passed:
        print("\n🎉 ALL SDLC UNIT TESTS PASSED!")
    else:
        print("\n❌ SDLC TEST SUITE FAILED!")
        sys.exit(1)

def cmd_build(args):
    print("📦 Executing Production Build Verification...")
    ok, out = run_cmd("npm run build")
    if ok:
        print(out)
        print("✅ Production Vite build completed successfully! Output in dist/")
    else:
        print(f"❌ Build failed:\n{out}")
        sys.exit(1)

def cmd_package(args):
    client_name = args.client.strip().lower().replace(" ", "_")
    deploy_dir = os.path.join(DEPLOYMENTS_DIR, f"client_{client_name}")
    
    if not os.path.exists(deploy_dir):
        print(f"❌ Deployment directory '{deploy_dir}' not found. Run scaffold first.")
        return

    dist_tar = os.path.join(DEPLOYMENTS_DIR, f"client_{client_name}_release.tar.gz")
    with tarfile.open(dist_tar, "w:gz") as tar:
        tar.add(deploy_dir, arcname=f"client_{client_name}")
    
    print(f"📦 Release package compiled: {dist_tar} ({os.path.getsize(dist_tar)} bytes)")

def cmd_deploy_spec(args):
    client = args.client
    spec = {
        "client_name": client,
        "platform": "Linux (Ubuntu/Debian / Systemd / Docker)",
        "service_name": f"az_mobile_{client.lower().replace(' ', '_')}",
        "http_port": 8080,
        "database": "SQLite 3 (/opt/app/data/app.db)",
        "backup_strategy": "Automated nightly sqlite3 .backup to local /var/backups/",
        "health_check_endpoint": "http://127.0.0.1:8080/api/health",
        "systemd_unit": f"/etc/systemd/system/az_mobile_{client.lower().replace(' ', '_')}.service"
    }
    print("📋 CLIENT DEPLOYMENT SPECIFICATION:")
    print(json.dumps(spec, indent=2))

def main():
    parser = argparse.ArgumentParser(description="Master SDLC Engine for Arizona Mobile Software")
    subparsers = parser.add_subparsers(dest="subcommand", help="SDLC Lifecycle Command")

    # Scaffold
    scaffold_parser = subparsers.add_parser("scaffold", help="Scaffold client deployment micro-app")
    scaffold_parser.add_argument("--client", "-c", required=True, help="Client company name")
    scaffold_parser.add_argument("--template", "-t", default="quote-portal", choices=["quote-portal", "ops-cleaner"], help="Template to use")
    scaffold_parser.add_argument("--force", "-f", action="store_true", help="Overwrite existing deployment")

    # Test
    subparsers.add_parser("test", help="Run full automated test suite")

    # Build
    subparsers.add_parser("build", help="Run Vite production frontend build")

    # Package
    package_parser = subparsers.add_parser("package", help="Package client deployment into tar.gz bundle")
    package_parser.add_argument("--client", "-c", required=True, help="Client company name")

    # Deploy Spec
    spec_parser = subparsers.add_parser("deploy-spec", help="Generate production deployment specification JSON")
    spec_parser.add_argument("--client", "-c", required=True, help="Client company name")

    args = parser.parse_args()
    if args.subcommand == "scaffold":
        cmd_scaffold(args)
    elif args.subcommand == "test":
        cmd_test(args)
    elif args.subcommand == "build":
        cmd_build(args)
    elif args.subcommand == "package":
        cmd_package(args)
    elif args.subcommand == "deploy-spec":
        cmd_deploy_spec(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
