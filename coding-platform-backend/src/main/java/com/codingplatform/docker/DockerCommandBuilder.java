package com.codingplatform.docker;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

/**
 * Builds the `docker run` argument list used to execute one submission
 * inside an isolated, resource-limited, network-disabled container.
 */
@Component
public class DockerCommandBuilder {

    public List<String> build(String image, String workDirHostPath, String memoryLimit,
                               boolean networkDisabled, List<String> command) {
        List<String> args = new ArrayList<>();
        args.add("docker");
        args.add("run");
        args.add("-i");                              // keep stdin open for judge input
        args.add("--rm");                              // auto-remove after exit
        args.add("--memory=" + memoryLimit);            // hard memory cap
        args.add("--memory-swap=" + memoryLimit);        // disable swap growth
        args.add("--cpus=1");                            // single CPU
        args.add("--pids-limit=64");                     // fork-bomb protection
        args.add("--read-only");                         // read-only root fs
        args.add("--tmpfs=/tmp:rw,size=64m");             // writable scratch space
        if (networkDisabled) {
            args.add("--network=none");                  // no network access
        }
        args.add("-v");
        args.add(workDirHostPath + ":/sandbox:rw");
        args.add("-w");
        args.add("/sandbox");
        args.add("--user=nobody");                        // unprivileged execution
        args.add(image);
        args.addAll(command);
        return args;
    }
}
