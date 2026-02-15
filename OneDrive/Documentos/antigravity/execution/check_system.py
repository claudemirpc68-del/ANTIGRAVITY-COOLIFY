import sys
import datetime
import os

def main():
    print("=== Agent System Check ===")
    print(f"Time: {datetime.datetime.now()}")
    print(f"Python: {sys.version}")
    print(f"OS: {os.name}")
    print("Execution layer is operational.")
    print("==========================")

if __name__ == "__main__":
    main()
